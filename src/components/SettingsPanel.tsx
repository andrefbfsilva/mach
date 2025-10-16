import { X, Volume2, Vibrate, Monitor, Download, Upload, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useState } from "react";

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Settings Panel */}
      <div className="w-full max-w-md glass border-l border-primary/30 p-6 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">SETTINGS</h2>
            <p className="text-sm text-muted-foreground font-mono">
              SYSTEM CONFIGURATION
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Audio & Haptics */}
          <div className="module-panel rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Audio & Haptics
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Sound Effects</p>
                  <p className="text-xs text-muted-foreground">
                    Enable audio feedback
                  </p>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Haptic Feedback</p>
                  <p className="text-xs text-muted-foreground">
                    Enable vibration on touch
                  </p>
                </div>
              </div>
              <Switch
                checked={hapticEnabled}
                onCheckedChange={setHapticEnabled}
              />
            </div>
          </div>

          {/* Display */}
          <div className="module-panel rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Display
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Wake Lock</p>
                  <p className="text-xs text-muted-foreground">
                    Keep screen awake
                  </p>
                </div>
              </div>
              <Switch
                checked={wakeLockEnabled}
                onCheckedChange={setWakeLockEnabled}
              />
            </div>
          </div>

          {/* Data Management */}
          <div className="module-panel rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Data Management
            </h3>

            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4" />
              Export Data
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4" />
              Import Data
            </Button>
          </div>

          {/* About */}
          <div className="module-panel rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">About MACH</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                  Modular Activity Control Hub v1.0.0
                  <br />
                  Premium aviation-themed productivity dashboard
                  <br />
                  <br />
                  Designed for pilots of productivity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-primary/20">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success pulse-glow" />
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </div>
    </div>
  );
}
