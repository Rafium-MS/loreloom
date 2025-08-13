
import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', variant, size, asChild = false, children, ...props }, ref) => {
    const classes = [
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
      <textarea ref={ref} className={classes} {...props}>
        {children}
      </textarea>
    );
  }
);

Textarea.displayName = 'Textarea';
