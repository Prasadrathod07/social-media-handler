import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-border bg-black/[0.02] dark:bg-white/[0.03]">{children}</thead>;
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function Tr({ children, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className="hover:bg-black/[0.015] dark:hover:bg-white/[0.02]" {...rest}>
      {children}
    </tr>
  );
}

export function Th({ children, className = "", ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted ${className}`} {...rest}>
      {children}
    </th>
  );
}

export function Td({ children, className = "", ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3.5 align-middle ${className}`} {...rest}>
      {children}
    </td>
  );
}
