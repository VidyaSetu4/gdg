import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Paperclip, Mic, Image } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your VidyaSetu learning assistant. How can I help you today?", sender: 'bot', time: '10:30 AM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample responses for demo purposes
  const sampleResponses = {
    'hello': "Hi there! How can I assist with your studies today?",
    'help': "I can help you with your studies, answer questions about your courses, explain concepts, or direct you to relevant study materials. Just let me know what you need!",
    'math': "I'd be happy to help with math! What specific topic or problem are you working on?",
    'science': "Science is fascinating! Are you looking for help with biology, chemistry, physics, or another branch of science?",
    'test': "Do you need help preparing for a test? I can provide practice questions, explain concepts, or help you create a study plan.",
    'material': "You can find all your study materials in the Materials section. Would you like me to help you find something specific?",
    'class': "Your next class is Mathematics at 10:00 AM today. Would you like me to remind you 10 minutes before it starts?",
    'thank': "You're welcome! Feel free to ask if you need any more help with your studies.",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse = "I'm not sure how to respond to that. Could you please rephrase or ask something else?";
      
      // Check for keywords in the user's message
      for (const [keyword, response] of Object.entries(sampleResponses)) {
        if (inputMessage.toLowerCase().includes(keyword)) {
          botResponse = response;
          break;
        }
      }
      
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Learning Assistant</h1>
      
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-100 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Bot size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium">VidyaSetu Assistant</h2>
              <p className="text-xs text-gray-600">Online • Ready to help</p>
            </div>
          </div>
        </div>
        
        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <span 
                    className={`text-xs mt-1 block ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <Paperclip size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <Image size={20} />
            </button>
            <div className="flex-1 relative">
              <textarea
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="Type your message..."
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button 
                className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700"
                onClick={handleSendMessage}
              >
                <Send size={20} />
              </button>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;