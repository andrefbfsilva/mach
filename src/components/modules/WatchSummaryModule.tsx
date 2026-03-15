import { ListTodo, Timer, Zap, Inbox, Download } from "lucide-react";
import { Button } from "../ui/button";
import { useTaskStore, usePomodoroStore, useFocusStore, useInboxStore, useBridgeStore, useStore } from "@/store/useStore";
import { toast } from "sonner";

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return diffMin + "m ago";
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return diffH + "h ago";
  return Math.floor(diffH / 24) + "d ago";
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

function todayFocusMinutes(sessions: { startedAt: string; durationMinutes: number; endedAt: string | null }[], today: string) {
  return sessions
    .filter((s) => s.endedAt !== null && new Date(s.startedAt).toDateString() === today)
    .reduce((acc, s) => acc + s.durationMinutes, 0);
}

function formatMinutes(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function WatchSummaryModule() {
  const { tasks } = useTaskStore();
  const { pomodoro } = usePomodoroStore();
  const { focus } = useFocusStore();
  const { inbox } = useInboxStore();
  const { bridge } = useBridgeStore();

  // Next task: highest priority, not completed
  const pending = tasks.items.filter((t) => !t.completed);
  const nextTask = [...pending].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])[0] ?? null;

  // Focus stats
  const today = new Date().toDateString();
  const focusMin = todayFocusMinutes(focus.sessions, today);
  const goalMin = focus.dailyGoalMinutes;
  const goalReached = focusMin >= goalMin;

  // Inbox
  const inboxPending = inbox.items.filter((i) => !i.processed).length;

  const handleExportToWatch = () => {
    const cached = localStorage.getItem("mach-bridge-latest");
    if (!cached) {
      toast.error("No data to export yet");
      return;
    }
    const blob = new Blob([cached], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mach-bridge-latest.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("Exported to Watch");
    useStore.getState().markExported();
  };

  return (
    <div className="module-panel rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">WATCH SUMMARY</h3>
        <span className="text-[10px] font-mono text-muted-foreground border border-primary/30 rounded px-1.5 py-0.5">
          HUD
        </span>
      </div>

      {/* HUD lines */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {/* Next Task */}
        <div className="flex items-start gap-3">
          <ListTodo
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              nextTask?.priority === "high" ? "text-destructive" : "text-primary"
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-muted-foreground mb-0.5">NEXT TASK</div>
            {nextTask ? (
              <div
                className={`text-sm font-mono truncate ${
                  nextTask.priority === "high" ? "text-destructive" : "text-foreground"
                }`}
              >
                {nextTask.title}
                {nextTask.priority === "high" && (
                  <span className="ml-1 text-[9px] border border-destructive/50 rounded px-1 text-destructive">
                    HIGH
                  </span>
                )}
              </div>
            ) : (
              <div className="text-sm font-mono text-success">ALL CLEAR</div>
            )}
          </div>
        </div>

        <div className="border-t border-primary/10" />

        {/* Pomodoro */}
        <div className="flex items-center gap-3">
          <Timer className="w-4 h-4 text-accent flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[10px] font-mono text-muted-foreground mb-0.5">POMODORO</div>
            <div className="text-sm font-mono">
              <span className="text-accent">#{pomodoro.pomodorosCompleted}</span>
              <span className="text-muted-foreground mx-1">|</span>
              <span>CYCLE {pomodoro.cycleCount}/4</span>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10" />

        {/* Focus today */}
        <div className="flex items-center gap-3">
          <Zap
            className={`w-4 h-4 flex-shrink-0 ${goalReached ? "text-success" : "text-primary"}`}
          />
          <div className="flex-1">
            <div className="text-[10px] font-mono text-muted-foreground mb-0.5">FOCUS TODAY</div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-mono ${goalReached ? "text-success" : "text-foreground"}`}
              >
                {formatMinutes(focusMin)}
              </span>
              <span className="text-muted-foreground text-xs font-mono">
                / {formatMinutes(goalMin)}
              </span>
              {goalReached && (
                <span className="text-[9px] font-mono text-success border border-success/50 rounded px-1">
                  GOAL
                </span>
              )}
            </div>
            <div className="w-full h-1 bg-secondary rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  goalReached ? "bg-success" : "bg-primary"
                }`}
                style={{ width: `${Math.min((focusMin / goalMin) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10" />

        {/* Inbox */}
        <div className="flex items-center gap-3">
          <Inbox
            className={`w-4 h-4 flex-shrink-0 ${
              inboxPending > 0 ? "text-yellow-400" : "text-muted-foreground"
            }`}
          />
          <div className="flex-1">
            <div className="text-[10px] font-mono text-muted-foreground mb-0.5">INBOX</div>
            <div
              className={`text-sm font-mono ${
                inboxPending > 0 ? "text-yellow-400" : "text-muted-foreground"
              }`}
            >
              {inboxPending > 0 ? `${inboxPending} pending` : "empty"}
            </div>
          </div>
        </div>
      </div>

      {/* Export button */}
      <Button
        variant="cockpit"
        size="sm"
        className="w-full mt-4"
        onClick={handleExportToWatch}
      >
        <Download className="w-4 h-4 mr-2" />
        EXPORT TO WATCH
      </Button>

      {/* Status */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mt-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success pulse-glow" />
          BRIDGE READY
        </div>
        <span>
          {bridge.lastExportedAt ? "EXPORT: " + relativeTime(bridge.lastExportedAt) : "NEVER EXPORTED"}
        </span>
      </div>
    </div>
  );
}
