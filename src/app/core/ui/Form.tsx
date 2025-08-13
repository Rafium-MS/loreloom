// src/core/ui/Form.tsx
/* eslint-disable react/prop-types */
import React from 'react';
import Button from './Button';

export type FormRowProps = React.HTMLAttributes<HTMLDivElement>;
export function FormRow({ className = '', ...props }: FormRowProps) {
  const classes = ['flex flex-col gap-1', className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', ...props }, ref) => {
    const classes = ['text-sm font-medium', className].filter(Boolean).join(' ');
    return <label ref={ref} className={classes} {...props} />;
  }
);
Label.displayName = 'Label';

export const HelpText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => {
    const classes = ['text-xs text-[color:var(--color-muted)]', className]
      .filter(Boolean)
      .join(' ');
    return <p ref={ref} className={classes} {...props} />;
  }
);
HelpText.displayName = 'HelpText';

export const ErrorText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => {
    const classes = ['text-xs text-red-500 mt-1 hidden peer-invalid:block', className]
      .filter(Boolean)
      .join(' ');
    return <p ref={ref} className={classes} {...props} />;
  }
);
ErrorText.displayName = 'ErrorText';

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
}

export function FormActions({
  className = '',
  onCancel,
  saveLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  ...props
}: FormActionsProps) {
  const classes = [
    'sticky bottom-0 flex justify-end gap-2 border-t mt-4 bg-[color:var(--color-panel)] p-4',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      <Button type="submit">{saveLabel}</Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}
