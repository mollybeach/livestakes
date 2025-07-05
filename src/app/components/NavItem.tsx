import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  showLabel?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, showLabel = true }) => (
  <div
    className={`flex items-center gap-2 px-2 py-1 cursor-pointer border border-black hover:bg-pink-700 ${
      active ? "bg-pink-800" : "bg-pink-600"
    } ${!showLabel ? 'justify-center' : ''}`}
  >
    {icon}
    {showLabel && <span>{label}</span>}
  </div>
);

export default NavItem;
