
import React from 'react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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

    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = 'Input';