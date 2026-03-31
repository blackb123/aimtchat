import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  label, 
  className = '',
  onKeyDown 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-800 text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default Input;
