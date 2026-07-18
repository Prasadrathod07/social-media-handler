import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...rest }: InputProps) {
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground/80">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={`w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-brand-500 ${className}`}
        {...rest}
      />
    </div>
  );
}
