import { Gauge, Settings } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {

  return (
    <header className="glass h-16 flex items-center justify-between px-6 border-b border-primary/30">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
          <Gauge className="w-6 h-6 text-background" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wider">MACH</h1>
          <p className="text-xs text-muted-foreground font-mono">
            MODULAR ACTIVITY CONTROL HUB
          </p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4">
        {/* Clock */}
        <div className="text-sm font-mono text-muted-foreground">
          {new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="rounded-full"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
