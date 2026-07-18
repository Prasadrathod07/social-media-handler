import { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
}
