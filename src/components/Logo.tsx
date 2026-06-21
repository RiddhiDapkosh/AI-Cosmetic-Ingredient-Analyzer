import { Sparkles } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-mint text-mint-foreground shadow-sm">
        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">
        CosmetiScan<span className="text-mint"> AI</span>
      </span>
    </div>
  );
}