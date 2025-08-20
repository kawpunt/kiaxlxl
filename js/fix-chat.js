// Fix Facebook Messenger-style Chat
document.addEventListener('DOMContentLoaded', function() {
  console.log('Fixing Facebook Messenger-style chat...');
  
  // Function to convert old message format to Facebook-style bubbles
  function convertMessagesToFacebookStyle() {
    const chatBox = document.getElementById('user-chat-box');
    if (!chatBox) return;
    
    // Find all old-style messages
    const oldMessages = chatBox.querySelectorAll('div[style*="text-align"]');
    
    oldMessages.forEach(oldMsg => {
      const content = oldMsg.innerHTML;
      
      // Extract message details
      const isUser = content.includes('text-align:right');
      const messageMatch = content.match(/<strong>(.*?):<\/strong>\s*(.*?)\s*<small>(.*?)<\/small>/);
      
      if (messageMatch) {
        const sender = messageMatch[1];
        const text = messageMatch[2];
        const timestamp = messageMatch[3];
        
        // Create new Facebook-style message
        const newMessage = document.createElement('div');
        newMessage.className = `chat-message ${isUser ? 'user' : 'support'}`;
        
        // Format time properly
        const time = new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || timestamp;
        
        newMessage.innerHTML = `
          <div class="message-bubble">
            ${text}
            <div class="message-time">${time}</div>
          </div>
        `;
        
        // Replace old message with new one
        oldMsg.parentNode.replaceChild(newMessage, oldMsg);
      }
    });
  }
  
  // Override the sendUserMessage function
  const originalSendUserMessage = window.sendUserMessage;
  window.sendUserMessage = function() {
    const input = document.getElementById('user-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    
    const bookingId = document.getElementById('chat-booking-id').textContent.replace('#', '');
    const chatBox = document.getElementById('user-chat-box');
    
    // Create Facebook-style message bubble
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `
      <div class="message-bubble">
        ${text}
        <div class="message-time">${time}</div>
      </div>
    `;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Send via WebSocket if available
    if (window.userChatWS && window.userChatWS.readyState === WebSocket.OPEN) {
      window.userChatWS.send(JSON.stringify({
        type: 'chat_message',
        bookingId: bookingId,
        content: text,
        sender: 'user',
        timestamp: new Date().toISOString()
      }));
    } else {
      // Show error message
      setTimeout(() => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message support';
        errorDiv.innerHTML = `
          <div class="message-bubble">
            Chat not connected. Please try again.
            <div class="message-time">${time}</div>
          </div>
        `;
        chatBox.appendChild(errorDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 500);
    }
  };
  
  // Override the openUserChat function
  const originalOpenUserChat = window.openUserChat;
  window.openUserChat = async function(bookingId, service) {
    if (typeof closeMyBookings === 'function') {
      closeMyBookings();
    }
    
    document.getElementById('chat-booking-id').textContent = '#' + bookingId;
    document.getElementById('user-chat-modal').style.display = 'block';
    const chatBox = document.getElementById('user-chat-box');
    
    // Show loading message
    chatBox.innerHTML = `
      <div class="chat-message support">
        <div class="message-bubble">
          Loading messages...
          <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
      </div>
    `;
    
    try {
      const res = await fetch(getApiUrl(`/api/my-chat/${bookingId}`), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      const msgs = data.messages || [];
      
      // Clear and add Facebook-style messages
      chatBox.innerHTML = '';
      if (msgs.length === 0) {
        chatBox.innerHTML = `
          <div class="chat-message support">
            <div class="message-bubble">
              No messages yet. Start the conversation!
              <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
          </div>
        `;
      } else {
        msgs.forEach(m => {
          const messageClass = m.sender === 'user' ? 'user' : 'support';
          const time = new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          
          const messageDiv = document.createElement('div');
          messageDiv.className = `chat-message ${messageClass}`;
          messageDiv.innerHTML = `
            <div class="message-bubble">
              ${m.content}
              <div class="message-time">${time}</div>
            </div>
          `;
          chatBox.appendChild(messageDiv);
        });
      }
      
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (e) {
      chatBox.innerHTML = `
        <div class="chat-message support">
          <div class="message-bubble">
            Error loading messages. Please try again.
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
        </div>
      `;
    }
    
    // Connect WebSocket (existing code)
    if (originalOpenUserChat && typeof originalOpenUserChat === 'function') {
      // Call original function for WebSocket setup
      try {
        await originalOpenUserChat.call(this, bookingId, service);
      } catch (e) {
        console.log('WebSocket setup failed, continuing without it');
      }
    }
  };
  
  // Convert existing messages on page load
  setTimeout(convertMessagesToFacebookStyle, 100);
  
  // Also convert messages when chat modal is opened
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.querySelector && node.querySelector('#user-chat-box')) {
            setTimeout(convertMessagesToFacebookStyle, 100);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('Facebook Messenger-style chat fix loaded!');
});