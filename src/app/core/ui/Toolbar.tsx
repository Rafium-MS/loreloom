
import React from 'react';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}

export interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Define se o botão é togglável */
  togglable?: boolean;
  /** Texto do tooltip exibido após um pequeno delay */
  tooltip?: string;
  /** Delay em milissegundos para exibir o tooltip */
  tooltipDelay?: number;
}

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      className = '',
      togglable = false,
      tooltip,
      tooltipDelay = 500,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const [pressed, setPressed] = React.useState(false);
    const [showTooltip, setShowTooltip] = React.useState(false);
    const timer = React.useRef<number>();

    const activate = (e: React.SyntheticEvent<HTMLButtonElement>) => {
      if (togglable) setPressed((p) => !p);
      onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(e);
      }
    };

    const startTooltip = () => {
      if (tooltip) {
        timer.current = window.setTimeout(() => setShowTooltip(true), tooltipDelay);
      }
    };

    const clearTooltip = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setShowTooltip(false);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        aria-pressed={togglable ? pressed : undefined}
        onClick={activate}
        onKeyDown={handleKeyDown}
        onMouseEnter={startTooltip}
        onMouseLeave={clearTooltip}
        onFocus={startTooltip}
        onBlur={clearTooltip}
        {...props}
      >
        {children}
        {tooltip && showTooltip && (
          <span role="tooltip" className="toolbar-tooltip">
            {tooltip}
          </span>
        )}
      </button>
    );
  },
);

ToolbarButton.displayName = 'ToolbarButton';

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
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
        role: 'toolbar',
        ...props,
      });
    }

    return (
      <div ref={ref} className={classes} role="toolbar" {...props}>
        {children}
      </div>
    );
  },
);

Toolbar.displayName = 'Toolbar';