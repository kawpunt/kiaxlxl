/**
 * JYS Media AI Chatbot
 * Smart chatbot for digital marketing and sales automation
 * Features: Lead qualification, service information, 24/7 support
 */

class JYSChatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];
        this.userInfo = {};
        this.responses = this.initializeResponses();
        
        // Initialize chatbot when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.createChatWidget();
        this.bindEvents();
        this.showWelcomeMessage();
    }

    createChatWidget() {
        // Create chat toggle button
        const chatToggle = document.createElement('div');
        chatToggle.id = 'chat-toggle';
        chatToggle.className = 'chat-toggle';
        chatToggle.innerHTML = `
            <div class="chat-toggle-icon">
                <i class="fas fa-comments"></i>
                <span class="chat-notification">1</span>
            </div>
        `;

        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chat-container';
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chat-header-text">
                        <h3>JYS Assistant</h3>
                        <span class="chat-status">🟢 Online - Typically replies instantly</span>
                    </div>
                </div>
                <button class="chat-close" id="chat-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <div class="chat-message bot-message welcome-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>👋 Hi! I'm your JYS Media assistant.</p>
                        <p>I can help you learn about our digital marketing services, get pricing info, or connect you with our team!</p>
                        <div class="quick-options">
                            <button class="quick-option" data-message="What services do you offer?">
                                🎯 Our Services
                            </button>
                            <button class="quick-option" data-message="How much does it cost?">
                                💰 Pricing Info
                            </button>
                            <button class="quick-option" data-message="I want to get started">
                                🚀 Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <div class="chat-typing-indicator" id="typing-indicator" style="display: none;">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="chat-input-wrapper">
                    <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off">
                    <button id="chat-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        // Add styles
        this.addChatStyles();

        // Append to body
        document.body.appendChild(chatToggle);
        document.body.appendChild(chatContainer);
    }

    addChatStyles() {
        const styles = `
            <style id="chatbot-styles">
                /* Chat Toggle Button */
                .chat-toggle {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.35);
                    z-index: 10000;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    font-size: 24px;
                }

                .chat-toggle:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
                }

                .chat-toggle-icon {
                    position: relative;
                }

                .chat-notification {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse-notification 2s infinite;
                }

                @keyframes pulse-notification {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                /* Chat Container */
                .chat-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 350px;
                    height: 500px;
                    background: #111;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    transform: translateY(100%) scale(0.8);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: hidden;
                }

                .chat-container.open {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }

                .chat-header {
                    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                    color: #FFD700;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .chat-avatar {
                    width: 35px;
                    height: 35px;
                    background: rgba(255, 215, 0, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px; color:#FFD700;
                }

                .chat-header-text h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .chat-status {
                    font-size: 12px;
                    opacity: 0.9;
                    display: block;
                    margin-top: 2px;
                }

                .chat-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                .chat-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                /* Chat Messages */
                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #0b0b0b;
                }

                .chat-message {
                    display: flex;
                    margin-bottom: 15px;
                    animation: slideIn 0.3s ease;
                }

                .chat-message.user-message {
                    flex-direction: row-reverse;
                }

                .message-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 8px;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .bot-message .message-avatar {
                    background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
                    color: #000;
                }

                .user-message .message-avatar {
                    background: #e5e7eb;
                    color: #6b7280;
                }

                .message-content {
                    max-width: 80%;
                    background: #111;
                    color: #e5e7eb;
                    padding: 12px 15px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
                    word-wrap: break-word;
                    border: 1px solid #333;
                }

                .user-message .message-content {
                    background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
                    color: #000;
                }

                .message-content p {
                    margin: 0 0 8px 0;
                }

                .message-content p:last-child {
                    margin-bottom: 0;
                }

                /* Quick Options */
                .quick-options {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-top: 10px;
                }

                .quick-option {
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    color: #475569;
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                    font-size: 13px;
                }

                .quick-option:hover {
                    background: #e2e8f0;
                    transform: translateY(-1px);
                }

                /* Typing Indicator */
                .chat-typing-indicator {
                    display: flex;
                    margin-bottom: 15px;
                    align-items: flex-end;
                }

                .typing-dots {
                    background: white;
                    padding: 12px 15px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    display: flex;
                    gap: 4px;
                }

                .typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: #94a3b8;
                    border-radius: 50%;
                    animation: typing 1.4s infinite;
                }

                .typing-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typing {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.5;
                    }
                    30% {
                        transform: translateY(-10px);
                        opacity: 1;
                    }
                }

                /* Chat Input */
                .chat-input-container {
                    border-top: 1px solid #333;
                    padding: 15px;
                    background: #0f0f0f;
                }

                .chat-input-wrapper {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                #chat-input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid #333;
                    background:#0b0b0b; color:#e5e7eb;
                    border-radius: 25px;
                    outline: none;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                #chat-input:focus {
                    border-color: #FFD700;
                }

                #chat-send {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
                    color: #000;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }

                #chat-send:hover {
                    transform: scale(1.05);
                }

                #chat-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Animations */
                @keyframes slideIn {
                    from {
                        transform: translateY(10px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                /* Mobile Responsiveness */
                @media (max-width: 400px) {
                    .chat-container {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 100px);
                        right: 10px;
                        bottom: 10px;
                    }

                    .chat-toggle {
                        right: 15px;
                        bottom: 15px;
                    }
                }

                /* Pulse animation for chat button */
                .pulse {
                    animation: chatPulse 2s infinite;
                }

                @keyframes chatPulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');

        chatToggle.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick option buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-option')) {
                const message = e.target.getAttribute('data-message');
                this.sendUserMessage(message);
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatContainer = document.getElementById('chat-container');
        const chatToggle = document.getElementById('chat-toggle');
        const notification = chatToggle.querySelector('.chat-notification');
        
        chatContainer.classList.add('open');
        this.isOpen = true;
        
        // Hide notification badge
        if (notification) {
            notification.style.display = 'none';
        }
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
    }

    closeChat() {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.classList.remove('open');
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.sendUserMessage(message);
            input.value = '';
        }
    }

    sendUserMessage(message) {
        this.addMessage(message, 'user');
        this.conversationHistory.push({ role: 'user', content: message });
        
        // Process message and respond
        setTimeout(() => this.processMessage(message), 500);
    }

    addMessage(content, sender, isHTML = false) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isHTML) {
            contentDiv.innerHTML = content;
        } else {
            contentDiv.textContent = content;
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        indicator.style.display = 'flex';
        this.isTyping = true;
        
        // Scroll to show indicator
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        indicator.style.display = 'none';
        this.isTyping = false;
    }

    processMessage(message) {
        this.showTypingIndicator();
        
        // Simulate processing delay
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            
            if (Array.isArray(response)) {
                // Multiple responses
                response.forEach((resp, index) => {
                    setTimeout(() => {
                        this.addMessage(resp.content, 'bot', resp.isHTML);
                        this.conversationHistory.push({ role: 'bot', content: resp.content });
                    }, index * 1000);
                });
            } else {
                this.addMessage(response.content, 'bot', response.isHTML);
                this.conversationHistory.push({ role: 'bot', content: response.content });
            }
        }, Math.random() * 1000 + 500); // Random delay between 0.5-1.5s
    }

    generateResponse(message) {
        const msg = message.toLowerCase();
        
        // Check for specific patterns and return appropriate responses
        for (const pattern in this.responses) {
            if (this.matchesPattern(msg, pattern)) {
                const responses = this.responses[pattern];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        // Default response
        return {
            content: "I'd be happy to help you with that! For specific questions about our digital marketing services, pricing, or to get started with a custom solution, I can connect you with one of our specialists. Would you like me to set up a consultation for you?",
            isHTML: false
        };
    }

    matchesPattern(message, pattern) {
        const keywords = pattern.split('|');
        return keywords.some(keyword => message.includes(keyword.toLowerCase()));
    }

    initializeResponses() {
        return {
            'hello|hi|hey|good morning|good afternoon|good evening': [
                {
                    content: `<p>Hello! 👋 Welcome to JYS Media!</p>
                    <p>I'm here to help you grow your business with our proven digital marketing strategies. We've generated over $50M in revenue for our clients!</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="What services do you offer?">🎯 View Our Services</button>
                        <button class="quick-option" data-message="Show me your results">📊 Success Stories</button>
                        <button class="quick-option" data-message="I want to get started">🚀 Get Started</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'services|what do you do|what can you help|offerings': [
                {
                    content: `<p>🎯 We specialize in 6 core digital marketing services:</p>
                    <p><strong>📱 Meta Ads Management</strong> - Facebook & Instagram advertising that converts</p>
                    <p><strong>🔍 SEO Optimization</strong> - Dominate search results organically</p>
                    <p><strong>💰 Sales Funneling</strong> - Convert visitors into paying customers</p>
                    <p><strong>🤖 AI Chatbot Integration</strong> - 24/7 automated customer support</p>
                    <p><strong>🤝 Sales Consulting</strong> - Master the art of closing deals</p>
                    <p><strong>🏆 Proven Campaign Templates</strong> - Battle-tested strategies</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Tell me about Meta Ads">Learn More About Meta Ads</button>
                        <button class="quick-option" data-message="SEO pricing information">SEO Services</button>
                        <button class="quick-option" data-message="How much does it cost?">Get Pricing</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'meta ads|facebook ads|instagram ads|social media marketing|facebook marketing': [
                {
                    content: `<p>📱 <strong>Meta Ads Management - Our Specialty!</strong></p>
                    <p>We create high-converting Facebook and Instagram campaigns that have generated millions in revenue:</p>
                    <p>✅ <strong>Campaign Strategy & Setup</strong> - Custom campaigns for your goals</p>
                    <p>✅ <strong>Advanced Audience Targeting</strong> - Reach your ideal customers</p>
                    <p>✅ <strong>Creative Optimization</strong> - Ads that stop the scroll</p>
                    <p>✅ <strong>Performance Analytics</strong> - Data-driven improvements</p>
                    <p><strong>🎯 Average Results:</strong> 300% ROI increase, 10x more qualified leads</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Meta Ads pricing">Meta Ads Pricing</button>
                        <button class="quick-option" data-message="I want to get started">Get Started Today</button>
                        <button class="quick-option" data-message="Show me results">View Success Stories</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'seo|search engine optimization|google ranking|organic traffic|search results': [
                {
                    content: `<p>🔍 <strong>SEO Optimization - Dominate Search Results!</strong></p>
                    <p>Our proven SEO strategies increase organic traffic and boost your online visibility:</p>
                    <p>✅ <strong>Technical SEO Audit</strong> - Fix what's holding you back</p>
                    <p>✅ <strong>Keyword Research & Strategy</strong> - Target the right terms</p>
                    <p>✅ <strong>Content Optimization</strong> - Content that ranks and converts</p>
                    <p>✅ <strong>Link Building</strong> - Authority that Google loves</p>
                    <p><strong>📈 Typical Results:</strong> 250% increase in organic traffic within 6 months</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="SEO pricing information">SEO Pricing</button>
                        <button class="quick-option" data-message="How long does SEO take">SEO Timeline</button>
                        <button class="quick-option" data-message="I want to get started">Start SEO Project</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'sales funnel|funnel|landing page|conversion optimization|sales process': [
                {
                    content: `<p>💰 <strong>Sales Funneling - Convert More Visitors!</strong></p>
                    <p>High-performing sales funnels designed to maximize conversions at every stage:</p>
                    <p>✅ <strong>Funnel Strategy & Design</strong> - Custom funnel architecture</p>
                    <p>✅ <strong>Landing Page Optimization</strong> - Pages that convert</p>
                    <p>✅ <strong>Email Automation</strong> - Nurture leads automatically</p>
                    <p>✅ <strong>Conversion Tracking</strong> - Optimize based on data</p>
                    <p><strong>🎯 Average Results:</strong> 400% increase in conversion rates</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Funnel pricing">Funnel Pricing</button>
                        <button class="quick-option" data-message="Funnel examples">See Examples</button>
                        <button class="quick-option" data-message="I want to get started">Build My Funnel</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'chatbot|ai chatbot|automation|customer support|24/7 support': [
                {
                    content: `<p>🤖 <strong>AI Chatbot Integration - 24/7 Smart Support!</strong></p>
                    <p>You're talking to one right now! Our intelligent chatbots enhance user experience:</p>
                    <p>✅ <strong>Custom Chatbot Development</strong> - Tailored to your business</p>
                    <p>✅ <strong>Lead Qualification</strong> - Identify hot prospects automatically</p>
                    <p>✅ <strong>Customer Support Automation</strong> - Handle common questions</p>
                    <p>✅ <strong>Integration & Maintenance</strong> - Seamless setup and updates</p>
                    <p><strong>💡 Benefits:</strong> 60% reduction in support costs, 24/7 availability</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Chatbot pricing">Chatbot Pricing</button>
                        <button class="quick-option" data-message="How do chatbots work">How It Works</button>
                        <button class="quick-option" data-message="I want to get started">Add Chatbot to My Site</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'price|pricing|cost|how much|budget|investment': [
                {
                    content: `<p>💰 <strong>Investment Information</strong></p>
                    <p>Our pricing is based on your specific needs and goals. Here's a general overview:</p>
                    <p><strong>🎯 Meta Ads Management:</strong> $2,000-5,000/month + ad spend</p>
                    <p><strong>🔍 SEO Optimization:</strong> $3,000-8,000/month</p>
                    <p><strong>💰 Sales Funnels:</strong> $5,000-15,000 one-time</p>
                    <p><strong>🤖 AI Chatbot:</strong> $1,500-3,000 setup + $200-500/month</p>
                    <p><strong>📞 For exact pricing tailored to your business, let's schedule a free consultation!</strong></p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Schedule consultation">Free Consultation</button>
                        <button class="quick-option" data-message="ROI information">ROI Details</button>
                        <button class="quick-option" data-message="Payment plans">Payment Options</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'results|success stories|case studies|proof|testimonials|track record': [
                {
                    content: `<p>📊 <strong>Proven Results That Speak for Themselves:</strong></p>
                    <p><strong>💰 $50M+ Revenue Generated</strong> for our clients</p>
                    <p><strong>📈 300% Average ROI Increase</strong> across all campaigns</p>
                    <p><strong>🎯 500+ Successful Campaigns</strong> launched and optimized</p>
                    <p><strong>⭐ Client Testimonial:</strong></p>
                    <p><em>"JYS Media transformed our business. Our Meta ads now generate 10x more qualified leads, and their sales funnel increased our conversion rate by 400%."</em> - Sarah Johnson, CEO</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="More testimonials">More Success Stories</button>
                        <button class="quick-option" data-message="I want to get started">Get Similar Results</button>
                        <button class="quick-option" data-message="Schedule consultation">Free Strategy Call</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'get started|start now|begin|sign up|ready to start|let\'s do this|i\'m interested': [
                {
                    content: `<p>🚀 <strong>Fantastic! Let's Get You Started!</strong></p>
                    <p>Here's how we'll work together to grow your business:</p>
                    <p><strong>Step 1:</strong> 📞 Free 30-minute strategy consultation</p>
                    <p><strong>Step 2:</strong> 📋 Custom proposal based on your goals</p>
                    <p><strong>Step 3:</strong> 🎯 Campaign setup and launch</p>
                    <p><strong>Step 4:</strong> 📈 Results tracking and optimization</p>
                    <p><strong>Ready for your free consultation?</strong></p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Schedule consultation">📅 Schedule Free Call</button>
                        <button class="quick-option" data-message="Contact information">📞 Contact Info</button>
                        <button class="quick-option" data-message="What information do you need">❓ What You'll Need</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'contact|phone|email|reach out|get in touch|talk to human|speak to someone': [
                {
                    content: `<p>📞 <strong>Let's Connect!</strong></p>
                    <p>Ready to speak with our team? Here are the best ways to reach us:</p>
                    <p><strong>🎯 Best Option:</strong> Schedule a free 30-minute strategy call</p>
                    <p><strong>📧 Email:</strong> info@jysmedia.com</p>
                    <p><strong>📱 Phone:</strong> Available during consultation calls</p>
                    <p><strong>💬 Live Chat:</strong> Right here with me!</p>
                    <p>Our team typically responds within 2 hours during business days.</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Schedule consultation">📅 Book Free Call</button>
                        <button class="quick-option" data-message="Send email">📧 Send Email</button>
                        <button class="quick-option" data-message="Business hours">🕒 Business Hours</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'schedule|consultation|free call|meeting|appointment|book|calendar': [
                {
                    content: `<p>📅 <strong>Schedule Your Free Strategy Consultation</strong></p>
                    <p>Great choice! Our free 30-minute consultation will help you:</p>
                    <p>✅ Identify your biggest growth opportunities</p>
                    <p>✅ Get a custom marketing strategy</p>
                    <p>✅ Learn how we can help you achieve your goals</p>
                    <p>✅ See if we're a good fit to work together</p>
                    <p><strong>To schedule your call, I'll connect you with our contact form where you can choose your preferred time.</strong></p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Go to contact form" onclick="window.location.href='#contact'">📝 Contact Form</button>
                        <button class="quick-option" data-message="What to expect">🤔 What to Expect</button>
                        <button class="quick-option" data-message="Preparation tips">📋 How to Prepare</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'thanks|thank you|appreciate|helpful|great|awesome|perfect': [
                {
                    content: `<p>😊 <strong>You're very welcome!</strong></p>
                    <p>I'm thrilled I could help! Is there anything else you'd like to know about our digital marketing services?</p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="I want to get started">🚀 Let's Get Started</button>
                        <button class="quick-option" data-message="More questions">❓ I Have More Questions</button>
                        <button class="quick-option" data-message="Contact information">📞 Contact the Team</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'how long|timeline|when will i see results|timeframe': [
                {
                    content: `<p>⏰ <strong>Timeline & Results Expectations</strong></p>
                    <p>Great question! Here's what you can typically expect:</p>
                    <p><strong>📱 Meta Ads:</strong> 2-4 weeks to optimize, significant results in 30-60 days</p>
                    <p><strong>🔍 SEO:</strong> 3-6 months for major improvements, ongoing growth</p>
                    <p><strong>💰 Sales Funnels:</strong> 2-4 weeks to build, immediate impact once live</p>
                    <p><strong>🤖 Chatbots:</strong> 1-2 weeks setup, instant 24/7 support</p>
                    <p><strong>The key is consistent optimization and having realistic expectations!</strong></p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Fastest results">⚡ Quickest Wins</button>
                        <button class="quick-option" data-message="Long term strategy">🎯 Long-term Strategy</button>
                        <button class="quick-option" data-message="I want to get started">🚀 Start Now</button>
                    </div>`,
                    isHTML: true
                }
            ],
            
            'competitors|vs|comparison|different|why choose you|why jys': [
                {
                    content: `<p>🏆 <strong>What Makes JYS Media Different?</strong></p>
                    <p>Excellent question! Here's what sets us apart:</p>
                    <p>✅ <strong>$50M+ in proven results</strong> - Real numbers, not promises</p>
                    <p>✅ <strong>Battle-tested templates</strong> - We share what actually works</p>
                    <p>✅ <strong>Full-service approach</strong> - From ads to funnels to AI chatbots</p>
                    <p>✅ <strong>Transparent reporting</strong> - You see exactly what we're doing</p>
                    <p>✅ <strong>Personal attention</strong> - You're not just another account number</p>
                    <p><strong>We don't just run campaigns - we build growth systems that scale!</strong></p>
                    <div class="quick-options">
                        <button class="quick-option" data-message="Show me results">📊 See Our Results</button>
                        <button class="quick-option" data-message="Client testimonials">⭐ Client Reviews</button>
                        <button class="quick-option" data-message="I want to get started">🚀 Work With Us</button>
                    </div>`,
                    isHTML: true
                }
            ]
        };
    }

    showWelcomeMessage() {
        // Show a subtle notification after 3 seconds
        setTimeout(() => {
            const chatToggle = document.getElementById('chat-toggle');
            const notification = chatToggle.querySelector('.chat-notification');
            if (notification && !this.isOpen) {
                notification.style.display = 'flex';
                
                // Add pulse animation to chat button
                chatToggle.classList.add('pulse');
                
                // Remove pulse after 4 seconds
                setTimeout(() => {
                    chatToggle.classList.remove('pulse');
                }, 4000);
            }
        }, 3000);
    }
}

// Initialize the chatbot
const jysChatbot = new JYSChatbot();

// Expose for external access (for demo page)
window.jysChatbot = jysChatbot;

// Analytics tracking (if you have Google Analytics)
if (typeof gtag !== 'undefined') {
    // Track chatbot interactions
    document.addEventListener('click', (e) => {
        if (e.target.id === 'chat-toggle') {
            gtag('event', 'chatbot_opened', {
                'event_category': 'Engagement',
                'event_label': 'Chat Widget'
            });
        }
    });
}
