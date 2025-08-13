
import React from 'react';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
  open?: boolean;
  /** Callback acionado ao fechar o modal (Ex: pressionar Escape) */
  onClose?: () => void;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className = '',
      variant,
      size,
      asChild = false,
      children,
      open = true,
      onClose,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (!open || !innerRef.current) return;

      const previouslyFocused = document.activeElement as HTMLElement | null;
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',');

      const trapFocus = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose?.();
          return;
        }
        if (e.key !== 'Tab') return;

        const focusable = Array.from(
          innerRef.current?.querySelectorAll<HTMLElement>(focusableSelectors) || [],
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (active === last) {
          e.preventDefault();
          first.focus();
        }
      };

      const node = innerRef.current;
      node.addEventListener('keydown', trapFocus);

      const focusable = node.querySelectorAll<HTMLElement>(focusableSelectors);
      (focusable[0] || node).focus();

      return () => {
        node.removeEventListener('keydown', trapFocus);
        previouslyFocused?.focus();
      };
    }, [open, onClose]);

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
        ref: innerRef,
        role: 'dialog',
        'aria-modal': true,
        tabIndex: -1,
        ...props,
      });
    }

    return (
      <div
        ref={innerRef}
        className={classes}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Modal.displayName = 'Modal';