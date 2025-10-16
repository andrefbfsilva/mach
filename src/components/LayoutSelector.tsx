import { Grid2X2, LayoutGrid, LayoutList, Square } from "lucide-react";
import { Button } from "./ui/button";

export type LayoutType = "2-modules" | "3-modules-a" | "3-modules-b" | "4-modules";

interface LayoutSelectorProps {
  onSelectLayout: (layout: LayoutType) => void;
  onClose: () => void;
}

export function LayoutSelector({ onSelectLayout, onClose }: LayoutSelectorProps) {
  const layouts = [
    {
      id: "2-modules" as LayoutType,
      name: "2 MODULES",
      description: "Split screen layout",
      icon: Grid2X2,
      preview: (
        <div className="w-full h-32 flex gap-1">
          <div className="flex-1 bg-primary/20 border border-primary/40 rounded" />
          <div className="flex-1 bg-primary/20 border border-primary/40 rounded" />
        </div>
      ),
    },
    {
      id: "3-modules-a" as LayoutType,
      name: "3 MODULES A",
      description: "Large left + two right",
      icon: LayoutList,
      preview: (
        <div className="w-full h-32 flex gap-1">
          <div className="flex-1 bg-primary/20 border border-primary/40 rounded" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex-1 bg-primary/20 border border-primary/40 rounded" />
            <div className="flex-1 bg-primary/20 border border-primary/40 rounded" />
          </div>
        </div>
      ),
    },
    {
      id: "3-modules-b" as LayoutType,
      name: "3 MODULES B",
      description: "Two left + large right",
      icon: LayoutGrid,
      preview: (
        <div className="w-full h-32 flex gap-1">
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex-1 bg-primary/20 border border-primary/40 rounded" />
            <div className="flex-1 bg-primary/20 border border-primary/40 rounded" />
          </div>
          <div className="flex-1 bg-primary/20 border border-primary/40 rounded" />
        </div>
      ),
    },
    {
      id: "4-modules" as LayoutType,
      name: "4 MODULES",
      description: "Four equal quadrants",
      icon: Square,
      preview: (
        <div className="w-full h-32 grid grid-cols-2 gap-1">
          <div className="bg-primary/20 border border-primary/40 rounded" />
          <div className="bg-primary/20 border border-primary/40 rounded" />
          <div className="bg-primary/20 border border-primary/40 rounded" />
          <div className="bg-primary/20 border border-primary/40 rounded" />
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass rounded-lg p-8 max-w-4xl w-full mx-4 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">SELECT LAYOUT</h2>
          <p className="text-muted-foreground font-mono">
            Choose your control configuration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onSelectLayout(layout.id)}
              className="module-panel rounded-lg p-6 hover:border-primary hover:shadow-[0_0_30px_hsl(199_100%_50%_/_0.4)] transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary border border-primary/40 rounded flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <layout.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold mb-1">{layout.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {layout.description}
                  </p>
                </div>
              </div>
              {layout.preview}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={onClose}>
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  );
}
