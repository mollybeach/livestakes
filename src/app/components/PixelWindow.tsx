import React from "react";

const PixelWindow = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-pink-500/90 border-4 border-black rounded-none shadow-window-pixel">
    <div className="flex items-center justify-between px-3 py-1 bg-pink-600 text-yellow-50 font-pixel">
      <span>{title}</span>
      <button className="bg-yellow-400 hover:bg-yellow-300 px-1 leading-none text-black border border-black">✕</button>
    </div>
    <div className="bg-yellow-50 p-4 text-black font-pixel text-sm">{children}</div>
  </div>
);

export default PixelWindow; 