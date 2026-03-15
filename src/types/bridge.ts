import { Task, FocusSession, InboxItem } from '@/store/useStore'

export interface MachBridgeFile {
  version: 1
  exportedAt: string
  device: "ipad" | "watch" | "iphone"
  tasks: {
    items: Array<{
      id: string
      title: string
      completed: boolean
      priority: "high" | "medium" | "low"
      createdAt: string
    }>
    lastModified: string
  }
  pomodoro: {
    pomodorosCompleted: number
    cycleCount: number
    lastModified: string
  }
  focus: {
    sessions: Array<{
      id: string
      startedAt: string
      endedAt: string | null
      durationMinutes: number
      type: "pomodoro" | "manual"
    }>
    lastModified: string
  }
  inbox: Array<{
    id: string
    title: string
    source: string
    createdAt: string
    processed: boolean
  }>
  summary: {
    nextTask: { title: string; priority: string } | null
    pomodorosToday: number
    focusTodayMinutes: number
    focusDailyGoalMinutes: number
    inboxPending: number
  }
}

interface ExportableState {
  tasks: { items: Task[]; lastModified: string }
  pomodoro: { pomodorosCompleted: number; cycleCount: number; lastModified: string }
  focus: { sessions: FocusSession[]; dailyGoalMinutes: number; lastModified: string }
  inbox: { items: InboxItem[]; lastModified: string }
}

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }
const todayStr = () => new Date().toDateString()

export function createBridgeExport(state: ExportableState): MachBridgeFile {
  const today = todayStr()

  // Next task: highest priority, not completed
  const pendingTasks = state.tasks.items.filter((t) => !t.completed)
  const nextTask = pendingTasks
    .slice()
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1))[0] ?? null

  // Today's completed focus sessions
  const todaySessions = state.focus.sessions.filter(
    (s) => s.endedAt !== null && new Date(s.startedAt).toDateString() === today
  )
  const focusTodayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0)
  const pomodorosToday = todaySessions.filter((s) => s.type === "pomodoro").length

  const inboxPending = state.inbox.items.filter((i) => !i.processed).length

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    device: "ipad",
    tasks: {
      items: state.tasks.items.map(({ id, title, completed, priority, createdAt }) => ({
        id, title, completed, priority, createdAt,
      })),
      lastModified: state.tasks.lastModified,
    },
    pomodoro: {
      pomodorosCompleted: state.pomodoro.pomodorosCompleted,
      cycleCount: state.pomodoro.cycleCount,
      lastModified: state.pomodoro.lastModified,
    },
    focus: {
      sessions: state.focus.sessions.map(({ id, startedAt, endedAt, durationMinutes, type }) => ({
        id, startedAt, endedAt, durationMinutes, type,
      })),
      lastModified: state.focus.lastModified,
    },
    inbox: state.inbox.items.map(({ id, title, source, createdAt, processed }) => ({
      id,
      title,
      source,
      createdAt,
      processed,
    })),
    summary: {
      nextTask: nextTask ? { title: nextTask.title, priority: nextTask.priority } : null,
      pomodorosToday,
      focusTodayMinutes,
      focusDailyGoalMinutes: state.focus.dailyGoalMinutes,
      inboxPending,
    },
  }
}

export function parseBridgeImport(json: string): MachBridgeFile | null {
  try {
    const parsed = JSON.parse(json)
    if (parsed?.version !== 1) return null
    if (!parsed.tasks || !parsed.pomodoro || !parsed.focus) return null
    return parsed as MachBridgeFile
  } catch {
    return null
  }
}

export function mergeBridgeInbox(
  currentState: ExportableState,
  bridge: MachBridgeFile
): {
  tasksToAdd: Task[]
  pomodorosCompleted: number
  sessionsToAdd: FocusSession[]
  inboxItemsToImport: InboxItem[]
} {
  const existingTaskIds = new Set(currentState.tasks.items.map((t) => t.id))
  const existingSessionIds = new Set(currentState.focus.sessions.map((s) => s.id))
  const existingInboxIds = new Set(currentState.inbox.items.map((i) => i.id))

  // Tasks from bridge that don't already exist in store
  const tasksFromBridge: Task[] = bridge.tasks.items
    .filter((t) => !existingTaskIds.has(t.id))
    .map((t) => ({ ...t }))

  // Unprocessed inbox items converted to tasks (using inbox item id to prevent re-import)
  const seenNewTaskIds = new Set(tasksFromBridge.map((t) => t.id))
  const tasksFromInbox: Task[] = (bridge.inbox ?? [])
    .filter((item) => !item.processed && !existingTaskIds.has(item.id) && !seenNewTaskIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      completed: false,
      priority: "medium" as const,
      createdAt: item.createdAt,
    }))

  const tasksToAdd: Task[] = [...tasksFromBridge, ...tasksFromInbox]

  // pomodorosCompleted: max wins
  const pomodorosCompleted = Math.max(
    currentState.pomodoro.pomodorosCompleted,
    bridge.pomodoro.pomodorosCompleted
  )

  // Focus sessions: append new ones
  const sessionsToAdd: FocusSession[] = (bridge.focus.sessions ?? [])
    .filter((s) => !existingSessionIds.has(s.id))
    .map((s) => ({ ...s }))

  // Inbox items: append new ones
  const inboxItemsToImport: InboxItem[] = (bridge.inbox ?? [])
    .filter((i) => !existingInboxIds.has(i.id))
    .map((i) => ({ ...i }))

  return { tasksToAdd, pomodorosCompleted, sessionsToAdd, inboxItemsToImport }
}
