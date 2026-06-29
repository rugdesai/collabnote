import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${className}
        py-3
        rounded-full
        font-semibold
        text-black
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:brightness-105
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        backgroundColor: "#f4d953",
      }}
    >
      {children}
    </button>
  );
};

export default Button;