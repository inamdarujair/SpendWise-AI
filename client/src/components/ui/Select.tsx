import React, { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, wrapperClassName = '', className = '', ...props }, ref) => {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} className={wrapperClassName}>
        {label && <label className="sw-label">{label}</label>}
        <select
          ref={ref}
          className={`sw-select ${className}`}
          data-error={error ? 'true' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="sw-field-error">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
