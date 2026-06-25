import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  hint,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <input
        ref={ref}
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {hint && !error && <div className="form-hint">{hint}</div>}
    </div>
  );
});

Input.displayName = 'Input';
