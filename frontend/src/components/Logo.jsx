import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 40, className = '', alt = 'MentaliQ' }) => {
  const px = typeof size === 'number' ? `${size}px` : size;
  return (
    <Link to="/" aria-label="MentaliQ" className={`inline-flex items-center ${className}`}>
      <img src="/logo-mentaliQ.svg" alt={alt} style={{ width: px, height: 'auto' }} />
    </Link>
  );
};

export default Logo;
