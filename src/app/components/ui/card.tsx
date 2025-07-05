import React from "react";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm p-4 ${className || ''}`}>
    {children}
  </div>
);

export default Card; 