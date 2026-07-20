import React from 'react';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`sw-card ${className}`} {...props} />
  )
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        ...style,
      }}
      className={className}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', style, ...props }, ref) => (
    <h3
      ref={ref}
      style={{
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.01em',
        margin: 0,
        ...style,
      }}
      className={className}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      style={{ padding: '1.25rem 1.5rem', ...style }}
      className={className}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
      className={className}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
