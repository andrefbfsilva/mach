import { Timer, ListTodo, Clock, FileText } from "lucide-react";
import { Button } from "./ui/button";

export type ModuleType = "pomodoro" | "tasks" | "clock" | "notes";

interface ModuleSelectorProps {
  onSelectModule: (module: ModuleType) => void;
  onClose: () => void;
}

export function ModuleSelector({ onSelectModule, onClose }: ModuleSelectorProps) {
  const modules = [
    {
      id: "pomodoro" as ModuleType,
      name: "POMODORO TIMER",
      description: "Focus sessions with circular progress",
      icon: Timer,
      color: "from-primary to-accent",
    },
    {
      id: "tasks" as ModuleType,
      name: "TASK MANAGER",
      description: "Track and organize your missions",
      icon: ListTodo,
      color: "from-accent to-success",
    },
    {
      id: "clock" as ModuleType,
      name: "DUAL CLOCK",
      description: "Track multiple timezones",
      icon: Clock,
      color: "from-success to-primary",
    },
    {
      id: "notes" as ModuleType,
      name: "NOTES",
      description: "Markdown editor for flight logs",
      icon: FileText,
      color: "from-destructive to-accent",
    },
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass rounded-lg p-8 max-w-3xl w-full mx-4 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">SELECT MODULE</h2>
          <p className="text-muted-foreground font-mono">
            Choose a module to add to your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className="module-panel rounded-lg p-6 hover:border-primary hover:shadow-[0_0_30px_hsl(199_100%_50%_/_0.4)] transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <module.icon className="w-8 h-8 text-background" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {module.description}
                  </p>
                </div>
              </div>
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
