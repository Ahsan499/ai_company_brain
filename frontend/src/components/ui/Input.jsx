import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-heading mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-heading
            transition-colors
            placeholder:text-gray-400
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            hover:border-gray-400
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error' : 'border-border'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
