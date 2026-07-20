import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
}

export interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
}

type Props = InputProps | TextareaProps;

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, error, hint, as = 'input', wrapperClassName = '', className = '', ...props }, ref) => {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} className={wrapperClassName}>
        {label && (
          <label className="sw-label">{label}</label>
        )}
        {as === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`sw-textarea ${className}`}
            data-error={error ? 'true' : undefined}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={`sw-input ${className}`}
            data-error={error ? 'true' : undefined}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && <p className="sw-field-error">{error}</p>}
        {hint && !error && <p className="sw-field-hint">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
