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
    <div className="module-panel rounded-lg p-3 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold">TASK MANAGER</h3>
          <p className="text-[10px] font-mono text-muted-foreground">
            {completedCount}/{tasks.length} COMPLETE
          </p>
        </div>
        <Button
          variant="cockpit"
          size="sm"
          onClick={() => setShowInput(true)}
          className="h-7 min-h-0 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-secondary rounded-full mb-2 overflow-hidden flex-shrink-0">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${(completedCount / tasks.length) * 100}%` }}
        />
      </div>

      {/* New Task Input */}
      {showInput && (
        <div className="flex gap-1.5 mb-2 animate-fade-in flex-shrink-0">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            placeholder="Enter task..."
            className="bg-secondary border-primary/30 text-foreground h-8"
            autoFocus
          />
          <Button variant="cockpit" size="sm" onClick={addTask} className="h-8 min-h-0">
            ADD
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowInput(false)} className="h-8 min-h-0">
            ✕
          </Button>
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`group flex items-center gap-2 p-2 rounded bg-secondary border-l-4 ${priorityColors[task.priority]} hover:bg-secondary/80 transition-all`}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab flex-shrink-0" />
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0 min-h-0 min-w-0"
            >
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <span
              className={`flex-1 text-xs ${
                task.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity min-h-0 min-w-0 flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive hover:text-destructive/80" />
            </button>
          </div>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="mt-2 flex items-center gap-2 text-[10px] font-mono flex-shrink-0">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
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
