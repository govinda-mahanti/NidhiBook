import React, { useState, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../config/urlconfig'

const AIBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return

    const userMessage = inputMessage
    const newMessages = [...messages, { text: userMessage, sender: "user" }]
    setMessages(newMessages)
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${BASE_URL}/api/chat`, {
        message: userMessage
      })
      
      setMessages([...newMessages, { 
        text: response.data.botReply || response.data.message || "I received your message!", 
        sender: "bot" 
      }])

 
    } catch (error) {
      console.error('Error:', error)
      setMessages([...newMessages, { 
        text: error.response?.data?.error || "Sorry, I couldn't connect to the server. Please try again later.", 
        sender: "bot" 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {!isChatOpen && showWelcome && (
        <div className="fixed bottom-28 right-6 bg-gray-800 rounded-2xl shadow-lg p-4 z-40 max-w-xs border border-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-2xl">👋</span>
            <p className="text-gray-200 text-sm">Hi! How can I help you today?</p>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-900 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-700">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={24} />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button 
              onClick={toggleChat}
              className="hover:bg-white/20 rounded-full p-1 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {messages.length === 0 && (
              <div className="flex justify-start">
                <div className="max-w-[75%] px-4 py-2 rounded-lg bg-gray-700 text-gray-200 rounded-bl-none">
                  Hi! How can I help you today?
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-700 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] px-4 py-2 rounded-lg bg-gray-700 text-gray-200 rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center z-50"
      >
        {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </>
  )
}

export default AIBot