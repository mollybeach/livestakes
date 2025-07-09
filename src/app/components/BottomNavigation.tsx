"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, User, Heart, PlusSquare } from 'lucide-react';

const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      href: "/", 
      active: pathname === "/" 
    },
    { 
      icon: Search, 
      label: "Explore", 
      href: "/feed", 
      active: pathname === "/feed" 
    },
    { 
      icon: PlusSquare, 
      label: "Create", 
      href: "/create", 
      active: pathname === "/create" 
    },
    { 
      icon: Heart, 
      label: "Activity", 
      href: "/activity", 
      active: pathname === "/activity" 
    },
    { 
      icon: User, 
      label: "Profile", 
      href: "/profile", 
      active: pathname === "/profile" 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-pink-600 border-t-4 border-black px-4 py-2 md:hidden shadow-window-pixel">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 border-2 rounded-none ${
                item.active 
                  ? 'text-yellow-50 bg-purple-600 border-black scale-110 shadow-window-pixel' 
                  : 'text-yellow-200 border-transparent hover:text-yellow-50 hover:bg-pink-700 hover:border-black'
              }`}
            >
              <IconComponent 
                size={18} 
                className={item.active ? 'fill-current' : ''} 
              />
              <span className="text-xs font-pixel">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation; 