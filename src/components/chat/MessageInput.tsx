import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex items-center p-3 bg-white border-t border-gray-200">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-full text-sm px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="ml-2 bg-black text-sm text-white px-4 py-2 rounded-full transition duration-200"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
