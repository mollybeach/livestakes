"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MonitorPlay,
  Home,
  PieChart,
  MessageCircle,
  UserCircle2,
  HelpCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "./ui/button";
import NavItem from "./NavItem";

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { icon: <Home size={16} />, label: "Home", href: "/", active: pathname === "/" },
    { icon: <MonitorPlay size={16} />, label: "Livestreams", href: "/livestreams", active: pathname === "/livestreams" },
    { icon: <PieChart size={16} />, label: "Markets", href: "/markets", active: pathname === "/markets" },
    { icon: <MessageCircle size={16} />, label: "Chat", href: "/chat", active: pathname === "/chat" },
    { icon: <UserCircle2 size={16} />, label: "Profile", href: "/profile", active: pathname === "/profile" },
    { icon: <HelpCircle size={16} />, label: "Support", href: "/support", active: pathname === "/support" },
    { icon: <MoreHorizontal size={16} />, label: "More", href: "/more", active: pathname === "/more" },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-52'} bg-pink-600 text-yellow-50 flex flex-col gap-2 py-6 border-r-4 border-black transition-all duration-300 relative`}>
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 bg-pink-600 text-yellow-50 p-1 rounded-full border-2 border-black hover:bg-pink-700 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className="flex flex-col gap-3 px-3">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <NavItem 
              icon={item.icon} 
              label={item.label} 
              active={item.active} 
              showLabel={!isCollapsed} 
            />
          </Link>
        ))}
      </nav>
      
      {!isCollapsed && (
        <Button className="mx-3 mt-6 bg-yellow-400 hover:bg-yellow-300 text-black border border-black font-pixel uppercase tracking-wider">
          Create Market
        </Button>
      )}
    </aside>
  );
};

export default SideNav; 