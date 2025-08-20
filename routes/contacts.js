const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();

// Determine demo mode (no MongoDB required)
const isDemo = process.env.MONGODB_URI === 'demo_mode';

// Conditionally import Mongoose model only when not in demo mode
let Contact;
if (!isDemo) {
    Contact = require('../models/Contact');
}

// Email transporter setup
const createTransporter = () => {
    const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// In-memory store for contacts in demo mode
let demoContacts = [];
let demoIdCounter = 1;

// @route POST /api/contacts
// @desc Submit contact form
// @access Public
router.post('/', [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('service').isIn(['meta-ads', 'seo', 'funnels', 'chatbot', 'consulting', 'all']).withMessage('Please select a valid service'),
    body('message').notEmpty().trim().withMessage('Message is required').isLength({ max: 1000 }).withMessage('Message must be less than 1000 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, service, message } = req.body;

        // Create contact entry
        const contact = await Contact.create({
            name,
            email,
            phone: phone || '',
            service,
            message
        });

        // Send email notification (optional)
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = createTransporter();
                
                // Email to admin
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.ADMIN_EMAIL || 'admin@jysmedia.com',
                    subject: `New Contact Form Submission - ${service}`,
                    html: `
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                        <p><strong>Service:</strong> ${service}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                    `
                });

                // Auto-reply to user
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Thank you for contacting JYS Media',
                    html: `
                        <h2>Thank you for your inquiry!</h2>
                        <p>Hi ${name},</p>
                        <p>Thank you for reaching out to JYS Media. We have received your inquiry about our ${service} services.</p>
                        <p>Our team will review your message and get back to you within 24 hours.</p>
                        <p>In the meantime, feel free to explore our services and success stories on our website.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>The JYS Media Team</p>
                    `
                });
            }
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                service: contact.service
            }
        });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Something went wrong. Please try again later.' 
        });
    }
});

// @route GET /api/contacts
// @desc Get all contacts (Admin only)
// @access Private/Admin
router.get('/', async (req, res) => {
    try {
        const { status, service, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (service) query.service = service;

        const contacts = await Contact.find(query)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Contact.countDocuments(query);

        res.json({
            success: true,
            contacts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route PUT /api/contacts/:id
// @desc Update contact status (Admin only)
// @access Private/Admin
router.put('/:id', async (req, res) => {
    try {
        const { status, priority, notes, assignedTo } = req.body;
        
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status, priority, notes, assignedTo },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json({
            success: true,
            contact
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
