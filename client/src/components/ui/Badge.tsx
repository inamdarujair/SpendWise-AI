import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'gray', className = '', children, ...props }) => {
  return (
    <span
      className={`sw-badge sw-badge-${variant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
