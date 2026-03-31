import React from 'react';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          isOwn
            ? "bg-black rounded-br-[0px] text-white"
            : "bg-gray-200 rounded-bl-[0px] text-gray-800"
        } px-4 py-2 rounded-lg max-w-xs break-words`}
      >
        <p className="text-xs text-gray-400">{message.sender}</p>
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
