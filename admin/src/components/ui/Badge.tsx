type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-black/5 text-foreground/70 dark:bg-white/10 dark:text-white/70",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  danger: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300",
};

export function Badge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}
