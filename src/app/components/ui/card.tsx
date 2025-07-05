import React from "react";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}>
    {children}
  </div>
);

export default Card; 