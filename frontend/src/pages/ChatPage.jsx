import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState(''); // User's input message
  const [chatHistory, setChatHistory] = useState([]); // Store chat history
  const [isSending, setIsSending] = useState(false); // To control button state
  const [sliderPosition, setSliderPosition] = useState(0); // To track slider state

  // Handler for typing in the message
  const handleMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  // Sending message to backend
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty message

    setIsSending(true); // Disable button while waiting for AI response
    const newMessage = { from: 'user', text: userMessage };

    // Add the user's message to chat history
    setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);

    // Send the message to the backend
    try {
      const response = await fetch("/api/api/chat", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      // Add AI's response to chat history
      const aiMessage = { from: 'ai', text: data.response };
      setChatHistory((prevChatHistory) => [...prevChatHistory, aiMessage]);
      setIsSending(false); // Enable button after receiving the response
    } catch (error) {
      console.error('Error while sending message:', error);
      setIsSending(false);
    }

    setUserMessage(''); // Clear input after sending
  };

  // Clear chat history when leaving the page
  useEffect(() => {
    return () => {
      setChatHistory([]); // Clear history on unmount
    };
  }, []);

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button onClick={() => navigate('/')} className="back-button">Back</button>
        <h2>Chat with AI</h2>
        <button className="slider-button" onClick={() => setSliderPosition(sliderPosition === 0 ? 1 : 0)}>
          {sliderPosition === 0 ? 'Show History' : 'Hide History'}
        </button>
      </div>
      
      <div className={`chat-history ${sliderPosition === 0 ? 'hidden' : ''}`}>
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.from}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea
          placeholder="Type a new message here"
          value={userMessage}
          onChange={handleMessageChange}
          disabled={isSending}
        />
        <button
          onClick={handleSendMessage}
          className="send-button"
          disabled={isSending || !userMessage.trim()}
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
