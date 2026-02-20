import { Gauge, Settings } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {

  return (
    <header className="glass backdrop-blur-md h-10 flex-shrink-0 flex items-center justify-between px-4 border-b border-primary/30">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
          <Gauge className="w-4 h-4 text-background" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold tracking-wider">MACH</h1>
          <p className="text-[10px] text-muted-foreground font-mono hidden sm:block">
            MODULAR ACTIVITY CONTROL HUB
          </p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="text-xs font-mono text-muted-foreground">
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
          className="rounded-full h-7 w-7 min-h-0 min-w-0"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
