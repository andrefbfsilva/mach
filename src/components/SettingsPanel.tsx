import { useRef, useState } from "react";
import { X, Volume2, Vibrate, Monitor, Download, Upload, Info, Layout, Bell, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useSettingsStore, useStore } from "@/store/useStore";
import { createBridgeExport, parseBridgeImport, mergeBridgeInbox } from "@/types/bridge";
import { toast } from "sonner";

interface SettingsPanelProps {
  onClose: () => void;
  onChangeLayout?: () => void;
}

function makeTimestamp(): string {
  const now = new Date();
  return (
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    "-" +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0")
  );
}

function downloadJson(json: string, filename: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function SettingsPanel({ onClose, onChangeLayout }: SettingsPanelProps) {
  const { settings, toggleSound, toggleHaptic, toggleWakeLock } = useSettingsStore();
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  };

  const handleExport = async () => {
    const state = useStore.getState();
    const bridge = createBridgeExport(state);
    const json = JSON.stringify(bridge, null, 2);
    const filename = `mach-state-${makeTimestamp()}.json`;

    if ('showSaveFilePicker' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(json);
        await writable.close();
        toast("State exported successfully");
        return;
      } catch {
        // User cancelled or API not supported — fall through to blob download
      }
    }

    downloadJson(json, filename);
    toast("State exported successfully");
  };

  const handleImport = () => {
    importInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const bridge = parseBridgeImport(json);

      if (!bridge) {
        toast.error("Invalid MACH bridge file");
        return;
      }

      const currentState = useStore.getState();
      const { tasksToAdd, pomodorosCompleted, sessionsToAdd, inboxItemsToImport } =
        mergeBridgeInbox(currentState, bridge);

      useStore.setState((s) => ({
        tasks: {
          items: [...s.tasks.items, ...tasksToAdd],
          lastModified: new Date().toISOString(),
        },
        pomodoro: {
          ...s.pomodoro,
          pomodorosCompleted,
          lastModified: new Date().toISOString(),
        },
        focus: {
          sessions: [...s.focus.sessions, ...sessionsToAdd],
          lastModified: new Date().toISOString(),
        },
      }));

      currentState.importInboxItems(inboxItemsToImport);

      toast(
        `Imported: ${tasksToAdd.length} new tasks, ${inboxItemsToImport.length} inbox items, ${sessionsToAdd.length} focus sessions`
      );
    };
    reader.readAsText(file);

    // Reset so same file can be re-imported
    e.target.value = "";
  };

  const handleQuickExport = () => {
    const cached = localStorage.getItem("mach-bridge-latest");
    if (!cached) {
      toast.error("No cached state available");
      return;
    }
    downloadJson(cached, `mach-bridge-latest.json`);
    toast("Quick export downloaded");
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-background/80"
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
                checked={settings.soundEnabled}
                onCheckedChange={toggleSound}
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
                checked={settings.hapticEnabled}
                onCheckedChange={toggleHaptic}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Notifications</p>
                  {notifPermission === 'denied' ? (
                    <p className="text-xs text-destructive">
                      Enable in browser settings
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {notifPermission === 'granted' ? 'Pomodoro cycle alerts' : 'Allow system alerts'}
                    </p>
                  )}
                </div>
              </div>
              {notifPermission === 'granted' ? (
                <span className="text-xs font-mono text-success font-semibold">ENABLED</span>
              ) : notifPermission === 'denied' ? (
                <span className="text-xs font-mono text-destructive font-semibold">BLOCKED</span>
              ) : (
                <Button variant="cockpit" size="sm" onClick={handleRequestNotifications}>
                  ENABLE
                </Button>
              )}
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
                checked={settings.wakeLockEnabled}
                onCheckedChange={toggleWakeLock}
              />
            </div>
          </div>

          {/* Layout Configuration */}
          <div className="module-panel rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Layout Configuration
            </h3>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                onChangeLayout?.();
                onClose();
              }}
            >
              <Layout className="w-4 h-4" />
              Change Layout
            </Button>
          </div>

          {/* Data Management */}
          <div className="module-panel rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Data Management
            </h3>

            <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
              <Upload className="w-4 h-4" />
              Export Data
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={handleQuickExport}>
              <Zap className="w-4 h-4" />
              Quick Export
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={handleImport}>
              <Download className="w-4 h-4" />
              Import Data
            </Button>

            {/* Hidden file input for import */}
            <input
              ref={importInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* About */}
          <div className="module-panel rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">About MACH</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                  Modular Activity Control Hub v0.1.0
                  <br />
                  Premium aviation-themed productivity dashboard
                  <br />
                  <br />
                  Designed for pilots of productivity
                  <br />
                  <br />
                  Author: André Silva
                  <br />
                  Email: andrefbfsilva@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
