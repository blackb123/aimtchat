import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-black text-white text-sm font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
