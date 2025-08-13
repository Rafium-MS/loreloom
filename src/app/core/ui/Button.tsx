// src/core/ui/Button.tsx (exemplo)
import {cx} from "./cx";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary"|"ghost"|"outline"|"danger";
  size?: "sm"|"md"|"lg"; loading?: boolean;
};
export default function Button({variant="primary", size="md", loading, className, children, ...rest}:Props){
  const base = "border rounded-[var(--radius)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none";
  const variants = {
    primary: "bg-[var(--primary)] text-[var(--primary-contrast)] border-transparent hover:shadow-[0_0_6px_var(--primary)]",
    ghost: "bg-transparent text-[var(--color-text)] border-transparent hover:bg-[color:var(--color-panel)/.5] hover:shadow-[0_0_6px_var(--primary)]",
    outline: "bg-transparent text-[var(--primary)] border-[1px] border-[var(--primary)] hover:bg-[color:var(--primary)/.15] hover:shadow-[0_0_6px_var(--primary)]",
    danger: "bg-[var(--accent)] text-[var(--color-panel)] border-transparent hover:shadow-[0_0_6px_var(--accent)]",
  }[variant];
  const sizes = { sm:"px-3 py-1.5 text-sm", md:"px-4 py-2", lg:"px-5 py-3 text-base" }[size];
  return (
    <button className={cx(base, variants, sizes, className)} {...rest} disabled={loading||rest.disabled}>
      {loading ? "…" : children}
    </button>
  );
}
