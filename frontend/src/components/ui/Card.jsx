import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-surface rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 p-5 sm:p-6 md:p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
