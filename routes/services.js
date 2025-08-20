const express = require('express');
const router = express.Router();

// @route GET /api/services
// @desc Get all services
// @access Public
router.get('/', (req, res) => {
    const services = [
        {
            id: 'meta-ads',
            name: 'Meta Ads Management',
            description: 'Expert Facebook and Instagram advertising campaigns that maximize ROI and drive qualified leads to your business.',
            icon: 'fab fa-facebook',
            features: [
                'Campaign Strategy & Setup',
                'Advanced Audience Targeting',
                'Creative Optimization',
                'Performance Analytics'
            ],
            price: 'Starting at $1,500/month'
        },
        {
            id: 'seo',
            name: 'SEO Optimization',
            description: 'Dominate search results with our proven SEO strategies that increase organic traffic and boost your online visibility.',
            icon: 'fas fa-search',
            features: [
                'Technical SEO Audit',
                'Keyword Research & Strategy',
                'Content Optimization',
                'Link Building'
            ],
            price: 'Starting at $1,200/month'
        },
        {
            id: 'funnels',
            name: 'Sales Funneling',
            description: 'Convert visitors into customers with high-performing sales funnels designed to maximize conversions at every stage.',
            icon: 'fas fa-funnel-dollar',
            features: [
                'Funnel Strategy & Design',
                'Landing Page Optimization',
                'Email Automation',
                'Conversion Tracking'
            ],
            price: 'Starting at $2,000/project'
        },
        {
            id: 'chatbot',
            name: 'AI Chatbot Integration',
            description: 'Automate customer interactions and qualify leads 24/7 with intelligent chatbots that enhance user experience.',
            icon: 'fas fa-robot',
            features: [
                'Custom Chatbot Development',
                'Lead Qualification',
                'Customer Support Automation',
                'Integration & Maintenance'
            ],
            price: 'Starting at $800/month'
        },
        {
            id: 'consulting',
            name: 'Sales Consulting & Deal Closing',
            description: 'Master the art of closing deals with our proven sales methodologies and personalized coaching programs.',
            icon: 'fas fa-handshake',
            features: [
                'Sales Process Optimization',
                'Objection Handling',
                'Closing Techniques',
                'Team Training'
            ],
            price: 'Starting at $150/hour'
        }
    ];

    res.json({
        success: true,
        services
    });
});

module.exports = router;
