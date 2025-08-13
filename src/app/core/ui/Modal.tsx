
import React from 'react';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
  open?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className = '', variant, size, asChild = false, children, open = true, ...props }, ref) => {
    if (!open) return null;

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

Modal.displayName = 'Modal';
