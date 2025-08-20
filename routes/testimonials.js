const express = require('express');
const router = express.Router();

// @route GET /api/testimonials
// @desc Get all testimonials
// @access Public
router.get('/', (req, res) => {
    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            title: 'CEO, TechStart Solutions',
            message: 'JYS Media transformed our business. Our Meta ads now generate 10x more qualified leads, and their sales funnel increased our conversion rate by 400%.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b167?w=100&h=100&fit=crop&crop=face',
            rating: 5,
            service: 'Meta Ads & Funnels'
        },
        {
            id: 2,
            name: 'Michael Chen',
            title: 'Founder, Digital Innovations',
            message: 'The SEO optimization and AI chatbot integration resulted in a 250% increase in organic traffic and 60% reduction in customer service costs.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            rating: 5,
            service: 'SEO & AI Chatbot'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            title: 'Marketing Director, GrowthCorp',
            message: 'Their sales consulting helped us close 35% more deals. The team training was exceptional and the results speak for themselves.',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            rating: 5,
            service: 'Sales Consulting'
        },
        {
            id: 4,
            name: 'David Thompson',
            title: 'CEO, E-commerce Plus',
            message: 'ROI increased by 450% within the first 3 months. Their proven campaign templates saved us months of testing.',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
            rating: 5,
            service: 'Proven Campaigns'
        }
    ];

    res.json({
        success: true,
        testimonials
    });
});

module.exports = router;
