const express = require('express');
const router = express.Router();

// Predefined responses for the chatbot
const botResponses = {
    // Greetings
    greetings: [
        "Hello! Welcome to JYS Media. How can I help you today?",
        "Hi there! I'm here to assist you with any questions about our digital marketing services.",
        "Welcome to JYS Media! What can I do for you today?"
    ],
    
    // Services
    services: {
        keywords: ['service', 'services', 'what do you do', 'offerings', 'digital marketing'],
        responses: [
            "We offer comprehensive digital marketing services including:\n• Social Media Marketing\n• SEO & Content Marketing\n• PPC Advertising\n• Web Development\n• Email Marketing\n• Brand Strategy\n\nWhich service interests you most?"
        ]
    },
    
    // Pricing
    pricing: {
        keywords: ['price', 'cost', 'pricing', 'how much', 'budget', 'quote'],
        responses: [
            "Our pricing varies based on your specific needs and project scope. We offer:\n• Custom packages tailored to your business\n• Flexible monthly retainers\n• Project-based pricing\n\nWould you like to schedule a free consultation to discuss pricing?"
        ]
    },
    
    // Contact
    contact: {
        keywords: ['contact', 'reach', 'phone', 'email', 'address', 'location'],
        responses: [
            "You can reach us through:\n📧 Email: info@jysmedia.com\n📞 Phone: +1 (555) 123-4567\n📍 Address: 123 Business Ave, Digital City\n🕒 Hours: Mon-Fri 9AM-6PM\n\nWould you like me to connect you with our team?"
        ]
    },
    
    // Social Media
    social_media: {
        keywords: ['social media', 'facebook', 'instagram', 'twitter', 'linkedin', 'social'],
        responses: [
            "Our social media marketing services include:\n• Strategy Development\n• Content Creation & Scheduling\n• Community Management\n• Paid Social Advertising\n• Analytics & Reporting\n\nWhich platform are you most interested in?"
        ]
    },
    
    // SEO
    seo: {
        keywords: ['seo', 'search engine', 'google', 'ranking', 'organic'],
        responses: [
            "Our SEO services help improve your search rankings:\n• Keyword Research & Strategy\n• On-Page Optimization\n• Technical SEO Audits\n• Link Building\n• Local SEO\n• Monthly Reporting\n\nWhat's your current biggest SEO challenge?"
        ]
    },
    
    // Web Development
    web: {
        keywords: ['website', 'web development', 'web design', 'site', 'online'],
        responses: [
            "We create modern, responsive websites that convert:\n• Custom Web Design\n• E-commerce Development\n• Mobile Optimization\n• Performance Optimization\n• CMS Integration\n• Ongoing Maintenance\n\nDo you need a new website or improvements to an existing one?"
        ]
    },
    
    // About
    about: {
        keywords: ['about', 'company', 'team', 'experience', 'who are you'],
        responses: [
            "JYS Media is a full-service digital marketing agency with over 5 years of experience helping businesses grow online. We specialize in:\n• Data-driven strategies\n• Creative campaigns\n• Measurable results\n\nWe've helped 200+ businesses increase their online presence. What's your business goal?"
        ]
    },
    
    // Default responses
    default: [
        "I'd be happy to help you with that! Can you tell me more about what you're looking for?",
        "That's a great question! Let me connect you with one of our specialists who can provide detailed information.",
        "I want to make sure I give you the best answer. Could you be more specific about your needs?"
    ],
    
    // Goodbye
    goodbye: {
        keywords: ['bye', 'goodbye', 'thanks', 'thank you', 'see you'],
        responses: [
            "Thank you for your interest in JYS Media! Feel free to reach out anytime. Have a great day!",
            "It was great chatting with you! Don't hesitate to contact us if you need anything else.",
            "Thanks for stopping by! We're here whenever you're ready to grow your business online."
        ]
    }
};

// Function to find the best response
function findBestResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return getRandomResponse(botResponses.greetings);
    }
    
    // Check each category
    for (const [category, data] of Object.entries(botResponses)) {
        if (category === 'greetings' || category === 'default') continue;
        
        if (data.keywords) {
            for (const keyword of data.keywords) {
                if (lowerMessage.includes(keyword)) {
                    return getRandomResponse(data.responses);
                }
            }
        }
    }
    
    // Default response
    return getRandomResponse(botResponses.default);
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// @route POST /api/chatbot/message
// @desc Process chatbot message
// @access Public
router.post('/message', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        // Simulate thinking delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = findBestResponse(message);
        
        // Log conversation (in production, you might want to store this)
        console.log(`User ${userId || 'anonymous'}: ${message}`);
        console.log(`Bot: ${response}`);
        
        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ 
            error: 'Sorry, I encountered an error. Please try again or contact our support team.' 
        });
    }
});

// @route GET /api/chatbot/welcome
// @desc Get welcome message
// @access Public
router.get('/welcome', (req, res) => {
    const welcomeMessage = getRandomResponse(botResponses.greetings);
    
    res.json({
        success: true,
        response: welcomeMessage,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
