const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Import models only if not in demo mode
let User, Contact;
if (process.env.MONGODB_URI !== 'demo_mode') {
    User = require('../models/User');
    Contact = require('../models/Contact');
}

// Demo mode data
const demoUser = {
    _id: 'demo-admin-id',
    name: 'Demo Admin',
    email: 'admin@jysmedia.com',
    role: 'admin',
    avatar: '',
    phone: '',
    company: '',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date()
};

const demoContacts = [
    {
        _id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0123',
        service: 'meta-ads',
        message: 'Interested in Facebook advertising for my e-commerce store.',
        status: 'new',
        priority: 'high',
        notes: '',
        assignedTo: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        _id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        phone: '+1-555-0456',
        service: 'seo',
        message: 'Need SEO optimization for our corporate website.',
        status: 'contacted',
        priority: 'medium',
        notes: 'Follow up scheduled for next week',
        assignedTo: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        _id: '3',
        name: 'Mike Davis',
        email: 'mike@startup.io',
        phone: '+1-555-0789',
        service: 'funnels',
        message: 'Looking to create high-converting sales funnels.',
        status: 'converted',
        priority: 'high',
        notes: 'Project started, very satisfied with results',
        assignedTo: null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    },
    {
        _id: '4',
        name: 'Emily Rodriguez',
        email: 'emily@consulting.com',
        phone: '+1-555-0321',
        service: 'chatbot',
        message: 'Interested in AI chatbot for customer support.',
        status: 'new',
        priority: 'medium',
        notes: '',
        assignedTo: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
        _id: '5',
        name: 'David Chen',
        email: 'david@agency.com',
        phone: '+1-555-0654',
        service: 'consulting',
        message: 'Need sales consulting for our team.',
        status: 'contacted',
        priority: 'low',
        notes: 'Initial consultation completed',
        assignedTo: null,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    }
];

// Middleware to verify admin access
const requireAdmin = async (req, res, next) => {
    try {
        if (process.env.MONGODB_URI === 'demo_mode') {
            // In demo mode, allow access without token and use demo admin
            req.user = demoUser;
            return next();
        }

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Normal database mode
        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @route GET /api/admin/dashboard
// @desc Get dashboard statistics
// @access Private/Admin
router.get('/dashboard', requireAdmin, async (req, res) => {
    try {
        const now = new Date();
        if (process.env.MONGODB_URI === 'demo_mode') {
            // Compute stats from demoContacts
            const totalContacts = demoContacts.length;
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            const newContacts = demoContacts.filter(c => c.createdAt >= startOfWeek).length;
            const monthlyContacts = demoContacts.filter(c => c.createdAt >= startOfMonth).length;
            const contactsByStatus = Object.values(demoContacts.reduce((acc, c) => {
                acc[c.status] = acc[c.status] || { _id: c.status, count: 0 };
                acc[c.status].count += 1;
                return acc;
            }, {}));
            const serviceStats = Object.values(demoContacts.reduce((acc, c) => {
                acc[c.service] = acc[c.service] || { _id: c.service, count: 0 };
                acc[c.service].count += 1;
                return acc;
            }, {})).sort((a,b)=>b.count-a.count);
            const recentContacts = demoContacts
                .slice()
                .sort((a,b)=>b.createdAt - a.createdAt)
                .slice(0,5);
            const monthlyTrend = [];
            res.json({ success:true, stats: { totalContacts, newContacts, monthlyContacts, contactsByStatus, serviceStats, monthlyTrend }, recentContacts });
            return;
        }

        // Database-backed implementation
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const totalContacts = await Contact.countDocuments();
        const newContacts = await Contact.countDocuments({ createdAt: { $gte: startOfWeek } });
        const monthlyContacts = await Contact.countDocuments({ createdAt: { $gte: startOfMonth } });
        const contactsByStatus = await Contact.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
        const serviceStats = await Contact.aggregate([{ $group: { _id: '$service', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
        const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5).populate('assignedTo', 'name');
        const monthlyTrend = await Contact.aggregate([
            { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.json({ success:true, stats: { totalContacts, newContacts, monthlyContacts, contactsByStatus, serviceStats, monthlyTrend }, recentContacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route GET /api/admin/users
// @desc Get all users
// @access Private/Admin
router.get('/users', requireAdmin, async (req, res) => {
    try {
        if (process.env.MONGODB_URI === 'demo_mode') {
            return res.json({ success:true, users: [demoUser], totalPages:1, currentPage:1, total:1 });
        }
        const { page = 1, limit = 10, search } = req.query;
        
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route PUT /api/admin/users/:id
// @desc Update user
// @access Private/Admin
router.put('/users/:id', requireAdmin, async (req, res) => {
    try {
        const { name, email, role, isActive } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, isActive },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route DELETE /api/admin/users/:id
// @desc Delete user
// @access Private/Admin
router.delete('/users/:id', requireAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't allow deletion of admin users
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route GET /api/admin/contacts/export
// @desc Export contacts to CSV
// @access Private/Admin
router.get('/contacts/export', requireAdmin, async (req, res) => {
    try {
        if (process.env.MONGODB_URI === 'demo_mode') {
            // Build CSV from demoContacts
            let csv = 'Name,Email,Phone,Service,Status,Priority,Message,Created,Assigned To\n';
            demoContacts.forEach(contact => {
                const row = [
                    contact.name,
                    contact.email,
                    contact.phone || '',
                    contact.service,
                    contact.status,
                    contact.priority,
                    `"${contact.message.replace(/"/g, '""')}"`,
                    contact.createdAt.toISOString(),
                    ''
                ].join(',');
                csv += row + '\n';
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
            return res.send(csv);
        }
        const contacts = await Contact.find()
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        let csv = 'Name,Email,Phone,Service,Status,Priority,Message,Created,Assigned To\n';
        
        contacts.forEach(contact => {
            const row = [
                contact.name,
                contact.email,
                contact.phone || '',
                contact.service,
                contact.status,
                contact.priority,
                `"${contact.message.replace(/"/g, '""')}"`,
                contact.createdAt.toISOString(),
                contact.assignedTo ? contact.assignedTo.name : ''
            ].join(',');
            csv += row + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
        res.send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
