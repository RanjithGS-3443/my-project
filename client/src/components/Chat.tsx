import React, { useState, useEffect, useRef } from 'react';
import MessageContent from './MessageContent';
import { TypingAnimation } from './TypingAnimation';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  PaperAirplaneIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

const Chat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Initialize a new chat
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        text: 'Hello! How can I help you today?',
        isUser: false,
        timestamp: Date.now()
      }]
    };
    setChats(prevChats => [...prevChats, newChat]);
    setCurrentChat(newChat);
  };

  // Create initial chat if none exists
  useEffect(() => {
    // Initialize chat history
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats.length, createNewChat]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !currentChat) return;

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: Date.now()
    };

    setCurrentChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage]
    } : null);

    setChats(prevChats => {
      if (!currentChat) return prevChats;
      return prevChats.map(chat => 
        chat.id === currentChat.id
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      );
    });

    setInput('');
    setIsTyping(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        text: data.response,
        isUser: false,
        timestamp: Date.now()
      };

      setCurrentChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiMessage]
      } : null);

      setChats(prevChats => {
        return prevChats.map(chat => 
          chat.id === currentChat.id 
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        );
      });

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error while processing your request.',
        isUser: false,
        timestamp: Date.now()
      };

      setCurrentChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, errorMessage]
      } : null);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b dark:border-gray-700">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-gray-900 dark:text-white text-xl font-semibold">Chat App</h1>
        <ProfileMenu />
      </div>

      {/* Main content */}
      <div className="flex flex-1 h-full pt-16 md:pt-0">
        {/* Sidebar */}
        <div
          className={`fixed md:static inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 transition-transform duration-300 ease-in-out w-72 bg-white dark:bg-gray-800 shadow-xl md:shadow-none z-40 flex flex-col h-full`}
        >
          <div className="flex items-center p-4 border-b dark:border-gray-700">
            <button
              onClick={createNewChat}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex-1 shadow-md"
            >
              <PlusIcon className="h-5 w-5" />
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setCurrentChat(chat)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentChat?.id === chat.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {currentChat?.title || 'New Chat'}
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => document.documentElement.classList.toggle('dark')}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </button>
              <ProfileMenu />
            </div>
          </div>

          {currentChat && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                {currentChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-2xl">
                      <div
                        className={`rounded-2xl p-4 shadow-sm ${message.isUser
                          ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white'
                          : 'bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <MessageContent content={message.text} />
                      </div>
                      <div className={`text-xs mt-1 ${message.isUser ? 'text-right' : 'text-left'} text-gray-500 dark:text-gray-400`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-2xl">
                      <div className="rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <TypingAnimation />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <form onSubmit={handleSubmit} className="flex gap-4 max-w-4xl mx-auto">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className={`rounded-lg px-6 py-3 font-semibold text-white transition-all transform hover:scale-[1.02] ${!input.trim() || isTyping
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md'}`}
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
              {isTyping && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 animate-pulse">
                  AI is thinking...
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
