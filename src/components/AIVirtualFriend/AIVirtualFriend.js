import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sendMessage, loadConversationHistory, initializeConversation } from '../../services/geminiService';
import { addChatMessage, getChatHistory } from '../../firebases/firebaseService';
import { ref, remove } from 'firebase/database';
import { db } from '../../firebases/firebase';
import trashIcon from '../../assets/images/trash_button.png';
import Dialog from '../UI/Dialog';
import './AIVirtualFriend.css';

const AIVirtualFriend = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from Firebase on mount
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      
      try {
        const history = await getChatHistory(user.uid);
        if (history.length > 0) {
          setMessages(history);
          // Load history into Gemini service for context
          loadConversationHistory(history);
        } else {
          // Initialize with welcome message
          initializeConversation();
          const welcomeMessage = {
            message: "Hi! I'm your virtual friend. I'm here to listen and support you. How are you feeling today?",
            sender: 'ai',
            timestamp: Date.now(),
          };
          setMessages([welcomeMessage]);
          await addChatMessage(user.uid, welcomeMessage);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user]);

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      message: input.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };

    // Add user message to UI
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to Firebase
      await addChatMessage(user.uid, userMessage);

      // Get AI response
      const aiResponse = await sendMessage(userMessage.message);

      const aiMessage = {
        message: aiResponse,
        sender: 'ai',
        timestamp: Date.now(),
      };

      // Add AI message to UI
      setMessages(prev => [...prev, aiMessage]);

      // Save AI message to Firebase
      await addChatMessage(user.uid, aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        message: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle clear chat history
  const handleClearChat = () => {
    setIsDialogOpen(true);
  };

  const confirmClearChat = async () => {
    setIsDialogOpen(false);

    try {
      // Clear from Firebase - delete all messages
      const messagesRef = ref(db, `ChatMessages/${user.uid}`);
      await remove(messagesRef);

      // Reset local state
      setMessages([]);
      
      // Reinitialize conversation with welcome message
      initializeConversation();
      const welcomeMessage = {
        message: "Hi! I'm your virtual friend. I'm here to listen and support you. How are you feeling today?",
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
      await addChatMessage(user.uid, welcomeMessage);

      showToast('Chat history cleared successfully', 'success');
    } catch (error) {
      console.error('Error clearing chat history:', error);
      showToast('Failed to clear chat history. Please try again.', 'error');
    }
  };

  // Parse message text and convert keywords to clickable links
  const renderMessageWithLinks = (text) => {
    const keywords = {
      volcano: '/volcano',
      'self-care': '/self-care',
      'self care': '/self-care',
      'mood garden': '/mood-garden',
      community: '/community',
    };

    const parts = [];
    let lastIndex = 0;

    // Find all keyword matches
    Object.entries(keywords).forEach(([keyword, path]) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: text.slice(lastIndex, match.index),
          });
        }

        // Add link
        parts.push({
          type: 'link',
          content: match[0],
          path: path,
        });

        lastIndex = match.index + match[0].length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    // If no links found, return original text
    if (parts.length === 0) {
      return text;
    }

    // Render parts with links
    return parts.map((part, index) => {
      if (part.type === 'link') {
        return (
          <span
            key={index}
            className="message-link"
            onClick={() => navigate(part.path)}
          >
            {part.content}
          </span>
        );
      }
      return <span key={index}>{part.content}</span>;
    });
  };

  if (isLoadingHistory) {
    return (
      <div className="ai-friend-container">
        <div className="loading-screen">
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-friend-container">
      
      <div className="content-wrapper">
        {/* Header */}
        <div className="chat-header">
          <button className="back-button" onClick={() => navigate('/self-care')}>
            <IoArrowBack size={24} />
          </button>
          <h2>Chat with Friend</h2>
          <button className="clear-button" onClick={handleClearChat} title="Clear chat history">
            <img src={trashIcon} alt="Delete" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                {renderMessageWithLinks(msg.message)}
              </div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-bubble ai-message">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>

        {/* Confirmation Dialog */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={confirmClearChat}
          title="Delete Chat History"
          message="Are you sure you want to delete all chat history permanently? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AIVirtualFriend;
