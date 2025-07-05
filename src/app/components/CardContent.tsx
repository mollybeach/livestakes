import React from "react";

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-3 text-sm text-black font-pixel">{children}</div>
);

export default CardContent; 