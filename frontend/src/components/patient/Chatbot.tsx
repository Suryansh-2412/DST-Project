import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const context = useOutletContext<{ user: { id: string, name: string } }>();
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: `Hello ${context?.user?.name || ''}! I am your personal health assistant. I can help you with diet plans, exercise routines, or general health queries. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          user_id: context?.user?.id || 'public'
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: data.answer || "I'm sorry, I'm having trouble connecting to my knowledge base right now." 
      }]);
    } catch (err) {
      console.error("Chatbot Error:", err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: "I couldn't reach the assistant. Please make sure the AI service is running." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-card border border-gray-50 h-[500px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-primary/5 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-secondary">Health Assistant</h3>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? 'bg-gray-200' : 'bg-primary/10 text-primary'}`}>
                {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.type === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-gray-100 text-secondary rounded-tl-none'}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot size={14} />
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-xs text-text-gray italic">Assistant is typing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about diet, exercise..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button 
            onClick={handleSend}
            className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          AI can make mistakes. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
