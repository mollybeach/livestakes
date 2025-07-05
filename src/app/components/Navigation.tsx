"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/livestreams', label: 'Livestreams' },
    { href: '/livestakes', label: 'Markets' },
  ];

  return (
    <nav className="flex space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`transition-colors ${
            pathname === item.href
              ? 'text-purple-300 font-semibold'
              : 'text-gray-300 hover:text-purple-300'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation; 