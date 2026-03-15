import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { LayoutType } from '@/components/LayoutSelector'
import { ModuleType } from '@/components/ModuleSelector'

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: "high" | "medium" | "low"
  createdAt: string
}

export interface FocusSession {
  id: string
  startedAt: string
  endedAt: string | null
  durationMinutes: number
  type: "pomodoro" | "manual"
}

export interface InboxItem {
  id: string
  title: string
  source: string
  createdAt: string
  processed: boolean
}

interface MachState {
  // Data
  tasks: { items: Task[]; lastModified: string }
  pomodoro: {
    pomodorosCompleted: number
    cycleCount: number
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    autoStart: boolean
    lastModified: string
  }
  notes: { content: string; lastModified: string }
  clock: {
    selectedTimezone: string
    is24Hour: boolean
    customTimezones: string[]
    lastModified: string
  }
  settings: { soundEnabled: boolean; hapticEnabled: boolean; wakeLockEnabled: boolean }
  layout: { selectedLayout: LayoutType | null; modules: Record<number, ModuleType> }
  focus: { sessions: FocusSession[]; dailyGoalMinutes: number; lastModified: string }
  inbox: { items: InboxItem[]; lastModified: string }
  bridge: { lastExportedAt: string | null }

  // Task actions
  addTask: (task: { title: string; priority: "high" | "medium" | "low" }) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  reorderTasks: (items: Task[]) => void
  clearCompleted: () => void

  // Pomodoro actions
  incrementPomodoro: () => void
  resetCycle: () => void
  updatePomodoroSettings: (settings: Partial<{
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    autoStart: boolean
  }>) => void

  // Notes actions
  updateNotes: (content: string) => void

  // Clock actions
  setSelectedTimezone: (timezone: string) => void
  toggleTimeFormat: () => void
  addCustomTimezone: (timezone: string) => void
  removeCustomTimezone: (timezone: string) => void

  // Settings actions
  toggleSound: () => void
  toggleHaptic: () => void
  toggleWakeLock: () => void

  // Layout actions
  setLayout: (layout: LayoutType) => void
  setModuleInSlot: (slot: number, moduleType: ModuleType) => void
  removeModuleFromSlot: (slot: number) => void

  // Focus actions
  addFocusSession: (session: Omit<FocusSession, 'id'>) => string
  endFocusSession: (id: string) => void
  setDailyGoal: (minutes: number) => void

  // Inbox actions
  addInboxItem: (item: Omit<InboxItem, 'id'>) => void
  markInboxProcessed: (id: string) => void
  clearProcessedInbox: () => void
  importInboxItems: (items: InboxItem[]) => void

  // Bridge actions
  markExported: () => void

  // Focus maintenance
  pruneOldSessions: () => void
}

export const useStore = create<MachState>()(
  persist(
    (set) => ({
      tasks: { items: [], lastModified: new Date().toISOString() },
      pomodoro: {
        pomodorosCompleted: 0,
        cycleCount: 0,
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStart: false,
        lastModified: new Date().toISOString(),
      },
      notes: { content: "", lastModified: new Date().toISOString() },
      clock: {
        selectedTimezone: "Europe/London",
        is24Hour: true,
        customTimezones: [],
        lastModified: new Date().toISOString(),
      },
      settings: { soundEnabled: false, hapticEnabled: false, wakeLockEnabled: false },
      layout: { selectedLayout: "2-modules", modules: { 0: "pomodoro", 1: "tasks" } },
      focus: { sessions: [], dailyGoalMinutes: 240, lastModified: new Date().toISOString() },
      inbox: { items: [], lastModified: new Date().toISOString() },
      bridge: { lastExportedAt: null },

      addTask: ({ title, priority }) => {
        const newTask: Task = {
          id: Date.now().toString(),
          title,
          completed: false,
          priority,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          tasks: {
            items: [...s.tasks.items, newTask],
            lastModified: new Date().toISOString(),
          },
        }))
      },

      toggleTask: (id) => {
        set((s) => ({
          tasks: {
            items: s.tasks.items.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
            lastModified: new Date().toISOString(),
          },
        }))
      },

      deleteTask: (id) => {
        set((s) => ({
          tasks: {
            items: s.tasks.items.filter((t) => t.id !== id),
            lastModified: new Date().toISOString(),
          },
        }))
      },

      reorderTasks: (items) => {
        set(() => ({
          tasks: { items, lastModified: new Date().toISOString() },
        }))
      },

      clearCompleted: () => {
        set((s) => ({
          tasks: {
            items: s.tasks.items.filter((t) => !t.completed),
            lastModified: new Date().toISOString(),
          },
        }))
      },

      incrementPomodoro: () => {
        set((s) => {
          const newPomodorosCompleted = s.pomodoro.pomodorosCompleted + 1
          const newCycleCount = s.pomodoro.cycleCount + 1
          return {
            pomodoro: {
              ...s.pomodoro,
              pomodorosCompleted: newPomodorosCompleted,
              cycleCount: newCycleCount >= 4 ? 0 : newCycleCount,
              lastModified: new Date().toISOString(),
            },
          }
        })
      },

      resetCycle: () => {
        set((s) => ({
          pomodoro: {
            ...s.pomodoro,
            pomodorosCompleted: 0,
            cycleCount: 0,
            lastModified: new Date().toISOString(),
          },
        }))
      },

      updatePomodoroSettings: (settings) => {
        set((s) => ({
          pomodoro: {
            ...s.pomodoro,
            ...settings,
            lastModified: new Date().toISOString(),
          },
        }))
      },

      updateNotes: (content) => {
        set(() => ({
          notes: { content, lastModified: new Date().toISOString() },
        }))
      },

      setSelectedTimezone: (timezone) => {
        set((s) => ({
          clock: {
            ...s.clock,
            selectedTimezone: timezone,
            lastModified: new Date().toISOString(),
          },
        }))
      },

      toggleTimeFormat: () => {
        set((s) => ({
          clock: {
            ...s.clock,
            is24Hour: !s.clock.is24Hour,
            lastModified: new Date().toISOString(),
          },
        }))
      },

      addCustomTimezone: (timezone) => {
        set((s) => ({
          clock: {
            ...s.clock,
            customTimezones: [...s.clock.customTimezones, timezone],
            lastModified: new Date().toISOString(),
          },
        }))
      },

      removeCustomTimezone: (timezone) => {
        set((s) => ({
          clock: {
            ...s.clock,
            customTimezones: s.clock.customTimezones.filter((t) => t !== timezone),
            lastModified: new Date().toISOString(),
          },
        }))
      },

      toggleSound: () => {
        set((s) => ({
          settings: { ...s.settings, soundEnabled: !s.settings.soundEnabled },
        }))
      },

      toggleHaptic: () => {
        set((s) => ({
          settings: { ...s.settings, hapticEnabled: !s.settings.hapticEnabled },
        }))
      },

      toggleWakeLock: () => {
        set((s) => ({
          settings: { ...s.settings, wakeLockEnabled: !s.settings.wakeLockEnabled },
        }))
      },

      setLayout: (layout) => {
        set((s) => ({
          layout: { ...s.layout, selectedLayout: layout },
        }))
      },

      setModuleInSlot: (slot, moduleType) => {
        set((s) => ({
          layout: {
            ...s.layout,
            modules: { ...s.layout.modules, [slot]: moduleType },
          },
        }))
      },

      removeModuleFromSlot: (slot) => {
        set((s) => {
          const newModules = { ...s.layout.modules }
          delete newModules[slot]
          return { layout: { ...s.layout, modules: newModules } }
        })
      },

      addFocusSession: (session) => {
        const newSession: FocusSession = {
          id: Date.now().toString(),
          ...session,
        }
        set((s) => ({
          focus: {
            ...s.focus,
            sessions: [...s.focus.sessions, newSession],
            lastModified: new Date().toISOString(),
          },
        }))
        return newSession.id
      },

      endFocusSession: (id) => {
        set((s) => ({
          focus: {
            ...s.focus,
            sessions: s.focus.sessions.map((session) => {
              if (session.id !== id) return session
              const endedAt = new Date().toISOString()
              const durationMinutes = Math.floor(
                (Date.now() - new Date(session.startedAt).getTime()) / 60000
              )
              return { ...session, endedAt, durationMinutes }
            }),
            lastModified: new Date().toISOString(),
          },
        }))
      },

      setDailyGoal: (minutes) => {
        set((s) => ({
          focus: { ...s.focus, dailyGoalMinutes: minutes, lastModified: new Date().toISOString() },
        }))
      },

      addInboxItem: (item) => {
        const newItem: InboxItem = {
          id: Date.now().toString(),
          ...item,
        }
        set((s) => ({
          inbox: {
            items: [...s.inbox.items, newItem],
            lastModified: new Date().toISOString(),
          },
        }))
      },

      markInboxProcessed: (id) => {
        set((s) => ({
          inbox: {
            items: s.inbox.items.map((item) =>
              item.id === id ? { ...item, processed: true } : item
            ),
            lastModified: new Date().toISOString(),
          },
        }))
      },

      clearProcessedInbox: () => {
        set((s) => ({
          inbox: {
            items: s.inbox.items.filter((item) => !item.processed),
            lastModified: new Date().toISOString(),
          },
        }))
      },

      importInboxItems: (items) => {
        set((s) => {
          const existingIds = new Set(s.inbox.items.map((i) => i.id))
          const newItems = items.filter((i) => !existingIds.has(i.id))
          if (newItems.length === 0) return s
          return {
            inbox: {
              items: [...s.inbox.items, ...newItems],
              lastModified: new Date().toISOString(),
            },
          }
        })
      },

      markExported: () => {
        set(() => ({
          bridge: { lastExportedAt: new Date().toISOString() },
        }))
      },

      pruneOldSessions: () => {
        const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000
        set((s) => {
          const filtered = s.focus.sessions.filter(
            (session) => new Date(session.startedAt).getTime() >= cutoff
          )
          if (filtered.length === s.focus.sessions.length) return s
          return {
            focus: {
              ...s.focus,
              sessions: filtered,
              lastModified: new Date().toISOString(),
            },
          }
        })
      },

    }),
    {
      name: 'mach-store',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>
        if (version === 0) {
          const focus = state.focus as Record<string, unknown> | undefined
          if (focus && !('dailyGoalMinutes' in focus)) {
            focus.dailyGoalMinutes = 240
          }
          const clock = state.clock as Record<string, unknown> | undefined
          if (clock && typeof clock.selectedTimezone === 'string') {
            const legacyMap: Record<string, string> = {
              "New York": "America/New_York",
              "London":   "Europe/London",
              "Paris":    "Europe/Paris",
              "Tokyo":    "Asia/Tokyo",
              "Sydney":   "Australia/Sydney",
              "Dubai":    "Asia/Dubai",
            }
            if (legacyMap[clock.selectedTimezone]) {
              clock.selectedTimezone = legacyMap[clock.selectedTimezone]
            }
          }
        }
        return state as MachState
      },
    }
  )
)

// Convenience selectors
export const useTaskStore = () =>
  useStore(useShallow((s) => ({
    tasks: s.tasks,
    addTask: s.addTask,
    toggleTask: s.toggleTask,
    deleteTask: s.deleteTask,
    reorderTasks: s.reorderTasks,
    clearCompleted: s.clearCompleted,
  })))

export const usePomodoroStore = () =>
  useStore(useShallow((s) => ({
    pomodoro: s.pomodoro,
    incrementPomodoro: s.incrementPomodoro,
    resetCycle: s.resetCycle,
    updatePomodoroSettings: s.updatePomodoroSettings,
  })))

export const useNotesStore = () =>
  useStore(useShallow((s) => ({
    notes: s.notes,
    updateNotes: s.updateNotes,
  })))

export const useClockStore = () =>
  useStore(useShallow((s) => ({
    clock: s.clock,
    setSelectedTimezone: s.setSelectedTimezone,
    toggleTimeFormat: s.toggleTimeFormat,
    addCustomTimezone: s.addCustomTimezone,
    removeCustomTimezone: s.removeCustomTimezone,
  })))

export const useSettingsStore = () =>
  useStore(useShallow((s) => ({
    settings: s.settings,
    toggleSound: s.toggleSound,
    toggleHaptic: s.toggleHaptic,
    toggleWakeLock: s.toggleWakeLock,
  })))

export const useLayoutStore = () =>
  useStore(useShallow((s) => ({
    layout: s.layout,
    setLayout: s.setLayout,
    setModuleInSlot: s.setModuleInSlot,
    removeModuleFromSlot: s.removeModuleFromSlot,
  })))

export const useFocusStore = () =>
  useStore(useShallow((s) => ({
    focus: s.focus,
    addFocusSession: s.addFocusSession,
    endFocusSession: s.endFocusSession,
    setDailyGoal: s.setDailyGoal,
  })))

export const useInboxStore = () =>
  useStore(useShallow((s) => ({
    inbox: s.inbox,
    addInboxItem: s.addInboxItem,
    markInboxProcessed: s.markInboxProcessed,
    clearProcessedInbox: s.clearProcessedInbox,
    importInboxItems: s.importInboxItems,
  })))

export const useBridgeStore = () =>
  useStore(useShallow((s) => ({
    bridge: s.bridge,
    markExported: s.markExported,
  })))
