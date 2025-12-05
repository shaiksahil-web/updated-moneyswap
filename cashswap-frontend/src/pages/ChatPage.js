import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      from: user.phone,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isSent: true
    };

    setMessages((prev) => [...prev, newMessage]);
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Unknown';
    return phone.length > 10 ? phone.substring(0, 10) + '...' : phone;
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-avatar">💬</div>
            <div className="chat-header-info">
              <h2 className="chat-title">Chat Demo</h2>
              <span className="chat-status">
                <span className="status-dot"></span> Online
              </span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="icon-btn" title="Call">📞</button>
            <button className="icon-btn" title="Video">📹</button>
            <button className="icon-btn" title="More">⋮</button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-chat">
              <span className="empty-icon">💭</span>
              <p className="empty-title">No messages yet</p>
              <p className="empty-subtitle">Start the conversation by sending a message</p>
            </div>
          )}

          {messages.map((m, index) => {
            const isFirstInGroup = 
              index === 0 || 
              messages[index - 1].from !== m.from;
            
            return (
              <div key={m.id} className={`message-wrapper ${m.isSent ? 'sent' : 'received'}`}>
                {isFirstInGroup && !m.isSent && (
                  <div className="message-sender">{formatPhoneNumber(m.from)}</div>
                )}
                <div className="message-bubble">
                  <div className="message-text">{m.text}</div>
                  <div className="message-time">
                    {m.timestamp}
                    {m.isSent && <span className="message-status">✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <button className="icon-btn attachment-btn" title="Attach">
            📎
          </button>
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="chat-input"
              rows="1"
              maxLength="500"
            />
            {text.trim() && (
              <span className="char-count">{text.length}/500</span>
            )}
          </div>
          <button 
            type="button" 
            onClick={handleSend} 
            disabled={!text.trim()}
            className="send-btn"
            title="Send message"
          >
            <span className="send-icon">
              {text.trim() ? '✈️' : '🎤'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
