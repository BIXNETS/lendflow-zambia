import { cn } from "@/lib/utils";

export function Brand({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img src="/lendflow-logo.png" alt="LendFlow Africa logo" className="h-9 w-9 rounded-xl object-contain" />
      {showWord && (
        <span className="text-base font-extrabold tracking-tight leading-none">
          <span className="text-[color:var(--color-navy)]">Lend</span>
          <span className="text-[color:var(--color-leaf)]">Flow</span>
          <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--color-muted)]">Africa</span>
        </span>
      )}
    </span>
  );
}
