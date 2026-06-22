import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <input
        ref={ref}
        className={`text-input ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
});

Input.displayName = 'Input';
