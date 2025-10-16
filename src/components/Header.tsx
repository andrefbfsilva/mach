import { Gauge, Settings, Wifi, WifiOff } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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
            MODULAR ACTIVITY CONTROL
          </p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4">
        {/* Online/Offline Indicator */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-success pulse-glow" />
              <span className="text-xs font-mono text-success">ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-destructive pulse-glow" />
              <span className="text-xs font-mono text-destructive">
                OFFLINE
              </span>
            </>
          )}
        </div>

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
