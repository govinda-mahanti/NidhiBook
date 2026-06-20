import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { BASE_URL } from '../config/urlconfig';
const Advisor = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Get token from Redux store
  const token = useSelector((state) => state.auth.token);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // API call with token in header
      const response = await axios.post(
        `${BASE_URL}/api/finance-chat`,
        { message: inputMessage },
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.botReply || response.data.botReply || 'I received your message!',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Handle errors
      const errorMessage = {
        id: Date.now() + 1,
        text: error.response?.data?.message || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-55px)] bg-black">
      {/* Header */}


      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-200 mb-2">Welcome to Finance Advisor</h2>
              <p className="text-gray-400">Ask me anything about your finances, investments, or budgeting!</p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg'
                    : message.isError
                    ? 'bg-red-900/50 text-red-200 border border-red-700'
                    : 'bg-gray-800 text-gray-100 shadow-lg border border-gray-700'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <span className={`text-xs mt-1 block ${
                  message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </span>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-800 px-4 py-3 rounded-2xl shadow-lg border border-gray-700">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about finances, investments, budgeting..."
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Advisor;