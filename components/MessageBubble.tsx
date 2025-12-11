import React from 'react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

// Simple helper to render newlines as breaks and detect basic table formatting
const FormattedText = ({ text }: { text: string }) => {
  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {text}
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
        }`}
      >
        <div className={`text-sm mb-1 font-medium opacity-80 ${isUser ? 'text-blue-100' : 'text-slate-500'}`}>
          {isUser ? '나' : '차니 봇'}
        </div>
        <div className="text-base">
          <FormattedText text={message.text} />
        </div>
        <div className={`text-xs mt-2 text-right opacity-70 ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};