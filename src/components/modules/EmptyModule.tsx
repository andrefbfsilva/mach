import { Plus } from "lucide-react";

interface EmptyModuleProps {
  onAddClick: () => void;
}

export function EmptyModule({ onAddClick }: EmptyModuleProps) {
  return (
    <button
      onClick={onAddClick}
      className="module-panel rounded-lg h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer group"
    >
      <div className="w-16 h-16 rounded-full bg-secondary border-2 border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Plus className="w-8 h-8 text-primary animate-glow-pulse" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
          ADD MODULE
        </p>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          CLICK TO SELECT
        </p>
      </div>
    </button>
  );
}
