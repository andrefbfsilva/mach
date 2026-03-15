import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTaskStore } from "@/store/useStore";
import { useHaptic } from "@/hooks/useHaptic";
import { useSound } from "@/hooks/useSound";

export function TaskModule() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const { trigger } = useHaptic();
  const { play } = useSound();
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({ title: newTask.trim(), priority: "medium" });
      trigger("tap");
      play("beep");
      setNewTask("");
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
    trigger("heavy");
    deleteTask(id);
  };

  const completedCount = tasks.items.filter((t) => t.completed).length;

  const priorityColors = {
    high: "border-destructive bg-destructive/20",
    medium: "border-primary bg-primary/20",
    low: "border-accent bg-accent/20",
  };

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
        <Button
          variant="cockpit"
          size="sm"
          onClick={() => setShowInput(true)}
        >
          <Plus className="w-4 h-4" />
          ADD
        </Button>
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
        <div className="flex gap-2 mb-4 animate-fade-in">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
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
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.items.map((task) => (
          <div
            key={task.id}
            className={`group flex items-center gap-3 p-3 rounded bg-secondary border-l-4 ${priorityColors[task.priority]} hover:bg-secondary/80 transition-all`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
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
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-destructive hover:text-destructive/80" />
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
