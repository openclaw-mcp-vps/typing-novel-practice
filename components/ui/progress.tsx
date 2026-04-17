import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]", className)}>
      <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
