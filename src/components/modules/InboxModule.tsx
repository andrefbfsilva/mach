import { Inbox, ArrowRight, X, ChevronsRight, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useInboxStore, useTaskStore } from "@/store/useStore";
import { useHaptic } from "@/hooks/useHaptic";

const SOURCE_COLORS: Record<string, string> = {
  watch: "bg-primary/20 text-primary border-primary/40",
  iphone: "bg-accent/20 text-accent border-accent/40",
  shortcut: "bg-success/20 text-success border-success/40",
};

function relativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "yesterday";
  return `${diffD}d ago`;
}

export function InboxModule() {
  const { inbox, markInboxProcessed, clearProcessedInbox } = useInboxStore();
  const { addTask } = useTaskStore();
  const { trigger } = useHaptic();

  const pending = inbox.items.filter((i) => !i.processed);
  const processedCount = inbox.items.filter((i) => i.processed).length;

  const handleToTask = (id: string, title: string) => {
    addTask({ title, priority: "medium" });
    markInboxProcessed(id);
    trigger("tap");
  };

  const handleDismiss = (id: string) => {
    markInboxProcessed(id);
    trigger("tap");
  };

  const handleProcessAll = () => {
    pending.forEach((item) => {
      addTask({ title: item.title, priority: "medium" });
      markInboxProcessed(item.id);
    });
    trigger("success");
  };

  return (
    <div className="module-panel rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">INCOMING</h3>
          {pending.length > 0 && (
            <span className="bg-accent text-background text-[10px] font-mono font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {pending.length}
            </span>
          )}
        </div>
        <Inbox className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {pending.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm font-mono text-muted-foreground text-center">
              No incoming items —<br />all clear, pilot.
            </p>
          </div>
        ) : (
          pending.map((item) => {
            const sourceKey = item.source.toLowerCase();
            const badgeClass = SOURCE_COLORS[sourceKey] ?? "bg-muted/20 text-muted-foreground border-muted/40";
            return (
              <div
                key={item.id}
                className="bg-secondary rounded p-3 space-y-2 border border-primary/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm flex-1 leading-snug">{item.title}</span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border flex-shrink-0 ${badgeClass}`}
                  >
                    {item.source}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {relativeTime(item.createdAt)}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="cockpit"
                      size="sm"
                      className="h-6 px-2 text-[10px]"
                      onClick={() => handleToTask(item.id, item.title)}
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      TASK
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[10px]"
                      onClick={() => handleDismiss(item.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 space-y-2">
        {pending.length > 1 && (
          <Button
            variant="cockpit"
            size="sm"
            className="w-full"
            onClick={handleProcessAll}
          >
            <ChevronsRight className="w-4 h-4 mr-1" />
            PROCESS ALL ({pending.length})
          </Button>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <div
              className={`w-2 h-2 rounded-full ${
                pending.length > 0 ? "bg-accent pulse-glow" : "bg-success"
              }`}
            />
            {pending.length > 0 ? `${pending.length} PENDING` : "CLEARED"}
          </div>
          {processedCount > 0 && (
            <button
              onClick={() => clearProcessedInbox()}
              className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              CLEAR HISTORY
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
