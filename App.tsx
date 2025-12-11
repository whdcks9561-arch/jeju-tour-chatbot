import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatState } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { v4 as uuidv4 } from 'uuid'; // Since we can't use npm install, I'll use a simple random string generator in helper function below

// Simple ID generator since we can't depend on external packages like uuid in this specific prompt context if not provided.
// Ideally we'd use uuid.
const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  role: 'model',
  text: '안녕하세요! 차니 봇입니다.\n제휴 관광지 가격 정보와 제주 여행에 대한 다양한 정보를 안내해 드립니다.\n(예: "아르떼뮤지엄 가격 얼마야?", "비 오는 날 갈만한 곳 추천해줘")',
  timestamp: new Date(),
};

const App: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [INITIAL_MESSAGE],
    isLoading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isLoading: true,
      error: null,
    }));

    try {
      // Call API
      const responseText = await sendMessageToGemini(text, chatState.messages);

      const botMsg: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMsg],
        isLoading: false,
      }));
    } catch (error) {
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: '메시지를 처리하는 중 오류가 발생했습니다.',
      }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">차니 봇</h1>
            <p className="text-xs text-slate-500">Affiliate Price Guide</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-2">
        <div className="max-w-3xl mx-auto flex flex-col">
          {chatState.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Loading Indicator */}
          {chatState.isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                <div className="flex items-center gap-1.5 h-5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {chatState.error && (
             <div className="flex justify-center mb-4">
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm border border-red-100">
                   {chatState.error}
                </div>
             </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={chatState.isLoading} />
    </div>
  );
};

export default App;