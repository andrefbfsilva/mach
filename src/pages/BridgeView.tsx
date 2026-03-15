import { useStore } from "@/store/useStore";
import { createBridgeExport } from "@/types/bridge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function BridgeView() {
  const state = useStore();
  const bridge = createBridgeExport(state);
  const json = JSON.stringify(bridge, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    toast("Copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mach-bridge.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-success pulse-glow" />
            <h1 className="text-2xl font-bold font-mono tracking-wider">MACH BRIDGE</h1>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Bookmark this page for Shortcut access
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <Button variant="cockpit" size="sm" onClick={handleCopy}>
            COPY JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            DOWNLOAD
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4 text-xs font-mono text-muted-foreground">
          <span>TASKS: {bridge.tasks.items.length}</span>
          <span>POMODOROS: {bridge.pomodoro.pomodorosCompleted}</span>
          <span>SESSIONS: {bridge.focus.sessions.length}</span>
          <span>INBOX: {bridge.inbox.length}</span>
        </div>

        {/* JSON Viewer */}
        <pre className="bg-secondary border border-primary/30 rounded-lg p-4 text-xs font-mono text-foreground overflow-auto max-h-[70vh] leading-relaxed">
          {json}
        </pre>

        <p className="text-xs text-muted-foreground font-mono mt-4">
          EXPORTED AT: {bridge.exportedAt}
        </p>
      </div>
    </div>
  );
}
