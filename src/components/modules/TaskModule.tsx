import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTaskStore } from "@/store/useStore";
import { useHaptic } from "@/hooks/useHaptic";
import { useSound } from "@/hooks/useSound";
import { toast } from "sonner";
import type { Task } from "@/store/useStore";

export function TaskModule() {
  const { tasks, addTask, toggleTask, deleteTask, clearCompleted } = useTaskStore();
  const { trigger } = useHaptic();
  const { play } = useSound();
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({ title: newTask.trim(), priority: newPriority });
      trigger("tap");
      play("beep");
      setNewTask("");
      setNewPriority("medium");
      setShowInput(false);
    }
  };

  const handleToggleTask = (id: string) => {
    const task = tasks.items.find((t) => t.id === id);
    if (task && !task.completed) {
      trigger("success");
      play("chime");
    }
    toggleTask(id);
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.items.find((t) => t.id === id);
    if (!task) return;
    trigger("heavy");
    setDeletedTask(task);
    deleteTask(id);
    toast("Task deleted", {
      action: {
        label: "UNDO",
        onClick: () => {
          addTask({ title: task.title, priority: task.priority });
        },
      },
      duration: 5000,
    });
  };

  const completedCount = tasks.items.filter((t) => t.completed).length;

  const priorityColors = {
    high: "border-destructive bg-destructive/20",
    medium: "border-primary bg-primary/20",
    low: "border-accent bg-accent/20",
  };

  const priorityBtnBase = "px-2 py-1 text-xs font-semibold rounded border transition-colors";
  const priorityBtnActive = {
    high: "bg-destructive/20 border-destructive text-destructive",
    medium: "bg-primary/20 border-primary text-primary",
    low: "bg-accent/20 border-accent text-accent",
  };
  const priorityBtnInactive =
    "bg-transparent border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground";

  return (
    <div className="module-panel rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">TASK MANAGER</h3>
          <p className="text-xs font-mono text-muted-foreground">
            {completedCount}/{tasks.items.length} COMPLETE
          </p>
        </div>
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                trigger("heavy");
                clearCompleted();
                toast("Completed tasks cleared");
              }}
            >
              CLEAR DONE
            </Button>
          )}
          <Button
            variant="cockpit"
            size="sm"
            onClick={() => setShowInput(true)}
          >
            <Plus className="w-4 h-4" />
            ADD
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-secondary rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${tasks.items.length > 0 ? (completedCount / tasks.items.length) * 100 : 0}%` }}
        />
      </div>

      {/* New Task Input */}
      {showInput && (
        <div className="mb-4 animate-fade-in space-y-2">
          {/* Priority selector */}
          <div className="flex gap-2">
            {(["high", "medium", "low"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setNewPriority(p)}
                className={`${priorityBtnBase} ${newPriority === p ? priorityBtnActive[p] : priorityBtnInactive}`}
              >
                {p === "high" ? "H" : p === "medium" ? "M" : "L"}
              </button>
            ))}
            <span className="text-xs text-muted-foreground font-mono self-center ml-1">
              {newPriority.toUpperCase()}
            </span>
          </div>
          {/* Input row */}
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Enter task..."
              className="bg-secondary border-primary/30 text-foreground"
              autoFocus
            />
            <Button variant="cockpit" size="sm" onClick={handleAddTask}>
              ADD
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowInput(false)}>
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.items.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded bg-secondary border-l-4 ${priorityColors[task.priority]} hover:bg-secondary/80 transition-all`}
          >
            <button
              onClick={() => handleToggleTask(task.id)}
              className="flex-shrink-0"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <span
              className={`flex-1 text-sm ${
                task.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="opacity-30 hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs font-mono">
        <div
          className={`w-2 h-2 rounded-full ${
            tasks.items.length > 0 && completedCount === tasks.items.length ? "bg-success" : "bg-primary"
          } pulse-glow`}
        />
        <span className="text-muted-foreground">
          {tasks.items.length > 0 && completedCount === tasks.items.length
            ? "ALL SYSTEMS GO"
            : "TASKS PENDING"}
        </span>
      </div>
    </div>
  );
}
