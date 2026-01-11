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

// --- CONSTANT: Standard Welcome Message ---
const WELCOME_MSG = {
  message: "Hi! I'm your virtual friend. I'm here to listen and support you. How are you feeling today?",
  sender: 'ai',
  timestamp: Date.now(),
};

const AIVirtualFriend = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // FIX: Start with the Welcome Message by default. 
  // This ensures the screen is never empty.
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- HISTORY LOADING LOGIC ---
  useEffect(() => {
    // 1. Wait for Auth Check
    if (authLoading) return;

    // 2. If Guest/Not Logged In, stop loading (Default greeting stays)
    if (!user) {
      setIsLoadingHistory(false);
      return;
    }

    const loadHistory = async () => {
      try {
        const history = await getChatHistory(user.uid);
        
        if (history && history.length > 0) {
          // Case A: User has history -> Overwrite the default greeting
          setMessages(history);
          loadConversationHistory(history);
        } else {
          // Case B: No history -> The default [WELCOME_MSG] is already there.
          // We just ensure the AI service is ready and save this start to DB.
          initializeConversation();
          
          // Save the welcome message to Firebase silently (don't await/block UI)
          addChatMessage(user.uid, WELCOME_MSG).catch(err => 
            console.warn("Background save failed:", err)
          );
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // On error, we just keep the default [WELCOME_MSG] so the user can still chat.
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user, authLoading]);

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      message: input.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (user) {
        await addChatMessage(user.uid, userMessage);
      }

      const aiResponse = await sendMessage(userMessage.message);

      const aiMessage = {
        message: aiResponse,
        sender: 'ai',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);

      if (user) {
        await addChatMessage(user.uid, aiMessage);
      }
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setIsDialogOpen(true);
  };

  const confirmClearChat = async () => {
    setIsDialogOpen(false);

    try {
      if (user) {
        const messagesRef = ref(db, `ChatMessages/${user.uid}`);
        await remove(messagesRef);
      }

      // Reset to Welcome Message
      setMessages([WELCOME_MSG]);
      initializeConversation();
      
      if (user) {
        await addChatMessage(user.uid, WELCOME_MSG);
      }

      showToast('Chat history cleared successfully', 'success');
    } catch (error) {
      console.error('Error clearing chat history:', error);
      showToast('Failed to clear chat history. Please try again.', 'error');
    }
  };

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

    Object.entries(keywords).forEach(([keyword, path]) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: text.slice(lastIndex, match.index),
          });
        }

        parts.push({
          type: 'link',
          content: match[0],
          path: path,
        });

        lastIndex = match.index + match[0].length;
      }
    });

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    if (parts.length === 0) {
      return text;
    }

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

  // Only block UI if we are waiting for Auth or History
  if (isLoadingHistory || authLoading) {
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
        <div className="chat-header">
          <button className="back-button" onClick={() => navigate('/self-care')}>
            <IoArrowBack size={24} />
          </button>
          <h2>Chat with Friend</h2>
          <button className="clear-button" onClick={handleClearChat} title="Clear chat history">
            <img src={trashIcon} alt="Delete" />
          </button>
        </div>

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