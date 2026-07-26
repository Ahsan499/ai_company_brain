import React, { useId } from 'react';

const Checkbox = React.forwardRef(({ 
  label, 
  className = '', 
  ...props 
}, ref) => {
  const id = useId();

  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        ref={ref}
        className={`
          h-4 w-4 rounded border-gray-300 accent-primary
          focus:ring-primary focus:ring-2 focus:ring-offset-0 transition-colors cursor-pointer
          ${className}
        `}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm text-heading cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
