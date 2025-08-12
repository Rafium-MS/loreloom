// src/core/ui/Button.tsx (exemplo)
import {cx} from "./cx";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary"|"ghost"|"outline"|"danger";
  size?: "sm"|"md"|"lg"; loading?: boolean;
};
export default function Button({variant="primary", size="md", loading, className, children, ...rest}:Props){
  const base = "border rounded-[var(--radius)] transition";
  const variants = {
    primary: "bg-[var(--primary)] text-[var(--primary-contrast)] border-transparent hover:opacity-90",
    ghost: "bg-transparent text-[var(--color-text)] border-transparent hover:bg-[color:var(--color-panel)/.5]",
    outline: "bg-transparent text-[var(--color-text)] border-[1px] border-[color:var(--color-text)/.15] hover:bg-[color:var(--color-panel)/.5]",
    danger: "bg-[#ef4444] text-white border-transparent hover:opacity-90",
  }[variant];
  const sizes = { sm:"px-3 py-1.5 text-sm", md:"px-4 py-2", lg:"px-5 py-3 text-base" }[size];
  return (
    <button className={cx(base, variants, sizes, className)} {...rest} disabled={loading||rest.disabled}>
      {loading ? "…" : children}
    </button>
  );
}
