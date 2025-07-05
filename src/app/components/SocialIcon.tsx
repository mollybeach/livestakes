import React from 'react';

interface SocialIconProps {
  href: string;
  icon: string | React.ReactNode;
  label: string;
}

const SocialIcon = ({ href, icon, label }: SocialIconProps) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center text-gray-400 hover:text-purple-400 transition-colors"
      aria-label={label}
    >
      {typeof icon === 'string' ? (
        <span className="text-xl mr-2">{icon}</span>
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      <span>{label}</span>
    </a>
  );
};

export default SocialIcon; 