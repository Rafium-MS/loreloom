
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
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
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
