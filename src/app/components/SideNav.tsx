"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Store,
  MessageCircle,
  UserCircle2,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePrivy } from '@privy-io/react-auth';
import NavItem from "./NavItem";

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Default to expanded on desktop
  const pathname = usePathname();
  const router = useRouter();
  const { authenticated, login } = usePrivy();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { icon: <Home size={16} />, label: "Home", href: "/", active: pathname === "/", requiresAuth: false },
    { icon: <UserCircle2 size={16} />, label: "Profile", href: "/profile", active: pathname === "/profile", requiresAuth: true },
    { icon: <Store size={16} />, label: "Markets", href: "/markets", active: pathname === "/markets", requiresAuth: false },
    { icon: <MessageCircle size={16} />, label: "Chat", href: "/chat", active: pathname === "/chat", requiresAuth: true },
    { icon: <HelpCircle size={16} />, label: "Support", href: "/support", active: pathname === "/support", requiresAuth: false },
  ];

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.requiresAuth && !authenticated) {
      e.preventDefault();
      login();
      return;
    }
    // For non-auth required routes, let the Link handle navigation
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-52'} bg-fuchsia text-cream flex flex-col gap-2 py-4 lg:py-6 border-r-4 border-black transition-all duration-300 relative min-h-full overflow-y-auto`}>
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-4 lg:top-6 bg-periwinkle text-cream p-1 rounded-full border-2 border-black hover:bg-purple-800 transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className="flex flex-col gap-2 px-3 pt-8">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={(e) => handleNavClick(item, e)}>
            <NavItem 
              icon={item.icon} 
              label={item.label} 
              active={item.active} 
              showLabel={!isCollapsed} 
            />
          </Link>
        ))}
      </nav>
      


      {/* Social Links */}
      <div className="mt-auto px-3 pb-4">
        <div className="flex flex-col gap-2">
          <a 
            href="https://github.com/mollybeach/livestakes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cream hover:text-butter transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {!isCollapsed && <span className="text-xs font-pixel">GitHub</span>}
          </a>
          <a 
            href="https://twitter.com/livestakes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cream hover:text-butter transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            {!isCollapsed && <span className="text-xs font-pixel">Twitter</span>}
          </a>
        </div>
      </div>
    </aside>
  );
};

export default SideNav; 