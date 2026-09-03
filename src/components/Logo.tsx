import React from 'react';
import logo from '../assets/images/goldtribe-logo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'h-14',
    md: 'h-16',
    lg: 'h-20',
    xl: 'h-28',
  };

  return (
    <img
      src={logo}
      alt="Goldtribe Link Limited"
      className={`${dimensions[size]} w-auto object-contain`}
    />
  );
};