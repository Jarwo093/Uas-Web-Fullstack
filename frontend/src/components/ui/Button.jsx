import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = '',
  className = '',
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size ? `btn-${size}` : '';
  return (
    <button className={`btn ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
