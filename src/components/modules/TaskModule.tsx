import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export function TaskModule() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Complete mission briefing", completed: true, priority: "high" },
    { id: "2", title: "Review flight plan", completed: false, priority: "high" },
    { id: "3", title: "System diagnostics check", completed: false, priority: "medium" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask,
          completed: false,
          priority: "medium",
        },
      ]);
      setNewTask("");
      setShowInput(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

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
            {completedCount}/{tasks.length} COMPLETE
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
          style={{ width: `${(completedCount / tasks.length) * 100}%` }}
        />
      </div>

      {/* New Task Input */}
      {showInput && (
        <div className="flex gap-2 mb-4 animate-fade-in">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            placeholder="Enter task..."
            className="bg-secondary border-primary/30 text-foreground"
            autoFocus
          />
          <Button variant="cockpit" size="sm" onClick={addTask}>
            ADD
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowInput(false)}>
            ✕
          </Button>
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`group flex items-center gap-3 p-3 rounded bg-secondary border-l-4 ${priorityColors[task.priority]} hover:bg-secondary/80 transition-all`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            <button
              onClick={() => toggleTask(task.id)}
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
              onClick={() => deleteTask(task.id)}
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
            completedCount === tasks.length ? "bg-success" : "bg-primary"
          } pulse-glow`}
        />
        <span className="text-muted-foreground">
          {completedCount === tasks.length
            ? "ALL SYSTEMS GO"
            : "TASKS PENDING"}
        </span>
      </div>
    </div>
  );
}
