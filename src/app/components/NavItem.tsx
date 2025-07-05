import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  showLabel?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, showLabel = true }) => (
  <div
    className={`flex items-center gap-2 px-2 py-1 cursor-pointer border border-black hover:bg-purple-800 ${
      active ? "bg-purple-900" : "bg-plum"
    } ${!showLabel ? 'justify-center' : ''}`}
  >
    {icon}
    {showLabel && <span>{label}</span>}
  </div>
);

export default NavItem;
