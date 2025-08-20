// Facebook Messenger-style Chat Implementation

// Function to create Facebook-style message
function createFacebookMessage(content, sender, timestamp) {
  const messageClass = sender === 'user' ? 'user' : 'support';
  const time = new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${messageClass}`;
  messageDiv.innerHTML = `
    <div class="message-bubble">
      ${content}
      <div class="message-time">${time}</div>
    </div>
  `;
  return messageDiv;
}

// Override the openUserChat function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Store original functions
  const originalOpenUserChat = window.openUserChat;
  const originalSendUserMessage = window.sendUserMessage;

  // Override openUserChat function
  window.openUserChat = async function(bookingId, service) {
    if (typeof closeMyBookings === 'function') {
      closeMyBookings();
    }
    
    document.getElementById('chat-booking-id').textContent = '#' + bookingId;
    document.getElementById('user-chat-modal').style.display = 'block';
    const box = document.getElementById('user-chat-box');
    
    // Show loading with Facebook style
    box.innerHTML = '';
    box.appendChild(createFacebookMessage('Loading messages...', 'support', new Date().toISOString()));
    
    try {
      const res = await fetch(getApiUrl(`/api/my-chat/${bookingId}`), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      const msgs = data.messages;
      
      // Clear and add Facebook-style messages
      box.innerHTML = '';
      if (msgs.length === 0) {
        box.appendChild(createFacebookMessage('No messages yet. Start the conversation!', 'support', new Date().toISOString()));
      } else {
        msgs.forEach(m => {
          box.appendChild(createFacebookMessage(m.content, m.sender, m.timestamp));
        });
      }
      
      box.scrollTop = box.scrollHeight;
    } catch (e) {
      box.innerHTML = '';
      box.appendChild(createFacebookMessage('Error loading messages. Please try again.', 'support', new Date().toISOString()));
    }

    // Connect WebSocket
    if (window.userChatWS) window.userChatWS.close();
    const wsHost = (location.host && location.protocol.startsWith('http')) ? location.host : 'localhost:4000';
    window.userChatWS = new WebSocket('ws://' + wsHost);
    
    window.userChatWS.onopen = () => {
      window.userChatWS.send(JSON.stringify({
        type: 'auth',
        role: 'client',
        sessionId: bookingId.toString(),
        name: (typeof nameFromEmail === 'function' ? nameFromEmail(window.loggedInEmail) : null) || 'User',
        email: window.loggedInEmail || '',
        service: service
      }));
    };
    
    window.userChatWS.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'chat_message' && data.bookingId == bookingId) {
        box.appendChild(createFacebookMessage(data.content, data.sender, data.timestamp));
        box.scrollTop = box.scrollHeight;
      }
    };
    
    window.userChatWS.onclose = () => {
      console.log('User chat disconnected');
    };
  };

  // Override sendUserMessage function
  window.sendUserMessage = function() {
    const input = document.getElementById('user-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    
    const bookingId = document.getElementById('chat-booking-id').textContent.replace('#', '');
    const box = document.getElementById('user-chat-box');
    
    // Add user message with Facebook style
    box.appendChild(createFacebookMessage(text, 'user', new Date().toISOString()));
    box.scrollTop = box.scrollHeight;
    
    if (window.userChatWS && window.userChatWS.readyState === WebSocket.OPEN) {
      window.userChatWS.send(JSON.stringify({
        type: 'chat_message',
        bookingId: bookingId,
        content: text,
        sender: 'user',
        timestamp: new Date().toISOString()
      }));
    } else {
      // Show error message with Facebook style
      setTimeout(() => {
        box.appendChild(createFacebookMessage('Chat not connected. Please try again.', 'support', new Date().toISOString()));
        box.scrollTop = box.scrollHeight;
      }, 500);
    }
  };

  // Add Enter key support for chat input
  const chatInput = document.getElementById('user-chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendUserMessage();
      }
    });
  }

  console.log('Facebook Messenger-style chat loaded successfully!');
});