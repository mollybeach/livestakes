import React from "react";

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent = ({ children, className = "" }: CardContentProps) => (
  <div className={`p-3 text-sm text-black font-pixel ${className}`}>{children}</div>
);

export default CardContent; 