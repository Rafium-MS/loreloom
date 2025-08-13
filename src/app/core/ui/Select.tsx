
import React from 'react';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', variant, size, asChild = false, children, ...props }, ref) => {
    const classes = [
      'border rounded px-3 py-2 peer invalid:border-red-500',
      className,
      variant ? `variant-${variant}` : '',
      size ? `size-${size}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        className: classes,
        ref,
        ...props,
      });
    }

    return (
      <select ref={ref} className={classes} {...props}>
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';