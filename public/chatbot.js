class JYSChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userId = this.generateUserId();
        this.init();
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.loadWelcomeMessage();
    }

    createChatWidget() {
        // Create chatbot HTML structure
        const chatbotHTML = `
            <div id="jys-chatbot" class="jys-chatbot">
                <!-- Chat Toggle Button -->
                <div id="chat-toggle" class="chat-toggle">
                    <div class="chat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
                            <circle cx="8" cy="10" r="1" fill="white"/>
                            <circle cx="12" cy="10" r="1" fill="white"/>
                            <circle cx="16" cy="10" r="1" fill="white"/>
                        </svg>
                    </div>
                    <div class="close-icon" style="display: none;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
                        </svg>
                    </div>
                    <div class="notification-badge" id="notification-badge">1</div>
                </div>

                <!-- Chat Window -->
                <div id="chat-window" class="chat-window">
                    <div class="chat-header">
                        <div class="bot-info">
                            <div class="bot-avatar">
                                <div class="bot-initial">JYS</div>
                            </div>
                            <div class="bot-details">
                                <div class="bot-name">JYS Assistant</div>
                                <div class="bot-status">
                                    <div class="status-dot"></div>
                                    <span>Online</span>
                                </div>
                            </div>
                        </div>
                        <div class="chat-actions">
                            <button id="minimize-chat" class="action-btn">−</button>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="chat-input-container">
                        <div class="quick-actions">
                            <button class="quick-btn" data-message="What services do you offer?">Services</button>
                            <button class="quick-btn" data-message="How much does it cost?">Pricing</button>
                            <button class="quick-btn" data-message="Contact information">Contact</button>
                        </div>
                        <div class="chat-input-area">
                            <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off">
                            <button id="send-message" class="send-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                        <div class="typing-indicator" id="typing-indicator" style="display: none;">
                            <div class="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span class="typing-text">Assistant is typing...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert chatbot HTML into page
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);

        // Add CSS styles
        this.addStyles();
    }

    addStyles() {
        const styles = `
            .jys-chatbot {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }

            .chat-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
                transition: all 0.3s ease;
                position: relative;
            }

            .chat-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4757;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: #111;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                display: none;
                flex-direction: column;
                overflow: hidden;
                transform: translateY(20px) scale(0.95);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .chat-window.show {
                display: flex;
                transform: translateY(0) scale(1);
                opacity: 1;
            }

            .chat-header {
                background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                color: #FFD700;
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .bot-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .bot-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255, 215, 0, 0.25);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                color:#FFD700;
            }

            .bot-name {
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 2px;
            }

            .bot-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                opacity: 0.9;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                background: #2ed573;
                border-radius: 50%;
                animation: blink 2s infinite;
            }

            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.5; }
            }

            .action-btn {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: background 0.2s ease;
            }

            .action-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #0b0b0b;
            }

            .message {
                margin-bottom: 16px;
                display: flex;
                align-items: flex-start;
                gap: 8px;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from { transform: translateY(10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .message.user {
                flex-direction: row-reverse;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                flex-shrink: 0;
            }

            .message.bot .message-avatar {
                background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
                color: #000;
            }

            .message.user .message-avatar {
                background: #e3f2fd;
                color: #1976d2;
            }

            .message-content {
                background: #111;
                color: #e5e7eb;
                padding: 12px 16px;
                border-radius: 16px;
                max-width: 250px;
                white-space: pre-line;
                line-height: 1.4;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
                border: 1px solid #333;
            }

            .message.user .message-content {
                background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
                color: #000;
            }

            .message-time {
                font-size: 11px;
                color: #999;
                margin-top: 4px;
                text-align: center;
            }

            .chat-input-container {
                padding: 16px;
                background: white;
                border-top: 1px solid #e9ecef;
            }

            .quick-actions {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            }

            .quick-btn {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 20px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
            }

            .quick-btn:hover {
                background: #e9ecef;
                border-color: #adb5bd;
            }

            .chat-input-area {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            #chat-input {
                flex: 1;
                border: 1px solid #333;
                background:#0b0b0b; color:#e5e7eb;
                border-radius: 24px;
                padding: 12px 16px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s ease;
            }

            #chat-input:focus {
                border-color: #FFD700;
            }

            .send-btn {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
                color: #000;
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .send-btn:hover {
                transform: scale(1.05);
            }

            .send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 0;
                font-size: 12px;
                color: #666;
            }

            .typing-dots {
                display: flex;
                gap: 3px;
            }

            .typing-dots span {
                width: 4px;
                height: 4px;
                background: #666;
                border-radius: 50%;
                animation: typingDot 1.5s infinite;
            }

            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typingDot {
                0%, 60%, 100% { transform: scale(1); opacity: 0.5; }
                30% { transform: scale(1.2); opacity: 1; }
            }

            @media (max-width: 480px) {
                .chat-window {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 100px);
                    bottom: 80px;
                    right: 20px;
                    left: 20px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    attachEventListeners() {
        const toggle = document.getElementById('chat-toggle');
        const minimize = document.getElementById('minimize-chat');
        const sendBtn = document.getElementById('send-message');
        const input = document.getElementById('chat-input');
        const quickBtns = document.querySelectorAll('.quick-btn');

        toggle.addEventListener('click', () => this.toggleChat());
        minimize.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                this.sendUserMessage(message);
            });
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
        const window = document.getElementById('chat-window');
        const toggle = document.getElementById('chat-toggle');
        const chatIcon = toggle.querySelector('.chat-icon');
        const closeIcon = toggle.querySelector('.close-icon');
        const badge = document.getElementById('notification-badge');

        window.classList.add('show');
        chatIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        badge.style.display = 'none';
        
        this.isOpen = true;

        // Auto-focus input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
    }

    closeChat() {
        const window = document.getElementById('chat-window');
        const toggle = document.getElementById('chat-toggle');
        const chatIcon = toggle.querySelector('.chat-icon');
        const closeIcon = toggle.querySelector('.close-icon');

        window.classList.remove('show');
        chatIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        
        this.isOpen = false;
    }

    async loadWelcomeMessage() {
        try {
            const response = await fetch('/api/chatbot/welcome');
            const data = await response.json();
            
            if (data.success) {
                this.addMessage('bot', data.response);
            }
        } catch (error) {
            console.error('Failed to load welcome message:', error);
            this.addMessage('bot', 'Hello! Welcome to JYS Media. How can I help you today?');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        try {
            const response = await fetch('/api/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    userId: this.userId
                })
            });
            
            const data = await response.json();
            
            // Hide typing indicator
            this.hideTyping();
            
            if (data.success) {
                this.addMessage('bot', data.response);
            } else {
                this.addMessage('bot', 'Sorry, I encountered an error. Please try again or contact our support team.');
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTyping();
            this.addMessage('bot', 'Sorry, I\'m having trouble connecting. Please check your internet connection and try again.');
        }
    }

    sendUserMessage(message) {
        const input = document.getElementById('chat-input');
        input.value = message;
        this.sendMessage();
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = sender === 'bot' ? 'JYS' : 'You';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble">
                <div class="message-content">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ sender, text, time });
    }

    showTyping() {
        document.getElementById('typing-indicator').style.display = 'flex';
    }

    hideTyping() {
        document.getElementById('typing-indicator').style.display = 'none';
    }
}

// Initialize chatbot when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.jysChatbot = new JYSChatbot();
    });
} else {
    window.jysChatbot = new JYSChatbot();
}
