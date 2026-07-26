import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Logo = ({
  className = '',
  iconSize = 32,
  showText = true,
  tagline,
}) => {
  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 min-w-0 ${className}`}>
      <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
        <BrainCircuit size={iconSize} className="text-primary" />
      </div>
      {showText && (
        <div className="min-w-0">
          <span className="block font-bold text-base sm:text-lg md:text-xl tracking-tight text-heading truncate leading-tight">
            AI Company Brain
          </span>
          {tagline && (
            <span className="block text-xs sm:text-sm text-secondaryText mt-0.5 truncate">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
