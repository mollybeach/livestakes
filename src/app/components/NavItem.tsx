import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  showLabel?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, showLabel = true }) => (
  <div className="relative group">
    <div
      className={`flex items-center gap-2 px-2 py-1 cursor-pointer border border-black hover:bg-purple-800 ${
        active ? "bg-purple-900" : "bg-plum"
      } ${!showLabel ? 'justify-center' : ''}`}
    >
      {icon}
      {showLabel && <span>{label}</span>}
    </div>
    
    {/* Tooltip for collapsed state */}
    {!showLabel && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </div>
);

export default NavItem;
