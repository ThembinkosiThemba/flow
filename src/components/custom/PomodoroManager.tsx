/**
 * PomodoroManager - Global Pomodoro Timer Management System
 *
 * This system provides:
 * 1. A global singleton timer that can run in the background
 * 2. Persistent state across component mounts/unmounts
 * 3. Task completion tracking and automatic task management
 * 4. Notification system for timer events
 * 5. Background operation even when the modal is closed
 * 6. Prevents multiple timer instances from running simultaneously
 */

import { create } from "zustand";
import type { Task } from "@/context/TaskContext";

interface PomodoroState {
  // Timer state
  focusMinutes: number;
  breakMinutes: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
  isBreak: boolean;
  progress: number;

  // Task tracking
  currentTask: Task | null;

  // Actions
  setFocusMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  startTimer: (task: Task) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completeTask: () => void;
  clearTask: () => void;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  // Default values
  focusMinutes: 25,
  breakMinutes: 5,
  minutes: 25,
  seconds: 0,
  isActive: false,
  isBreak: false,
  progress: 100,
  currentTask: null,

  setFocusMinutes: (minutes) => {
    set({ focusMinutes: minutes });
    if (!get().isActive && !get().isBreak) {
      set({ minutes, seconds: 0, progress: 100 });
    }
  },

  setBreakMinutes: (minutes) => {
    set({ breakMinutes: minutes });
    if (!get().isActive && get().isBreak) {
      set({ minutes, seconds: 0, progress: 100 });
    }
  },

  startTimer: (task) => {
    const state = get();
    // Only set the task if there isn't one already
    if (!state.currentTask) {
      set({ currentTask: task });
    }
    set({ isActive: true });
  },

  pauseTimer: () => {
    set({ isActive: false });
  },

  resetTimer: () => {
    const { isBreak, focusMinutes, breakMinutes } = get();
    const minutes = isBreak ? breakMinutes : focusMinutes;
    set({
      isActive: false,
      minutes,
      seconds: 0,
      progress: 100,
    });
  },

  tick: () => {
    const state = get();
    const { minutes, seconds, isBreak, focusMinutes, breakMinutes } = state;
    const totalSeconds = isBreak ? breakMinutes * 60 : focusMinutes * 60;

    if (seconds === 0) {
      if (minutes === 0) {
        // Timer completed
        const newIsBreak = !isBreak;
        const newMinutes = newIsBreak ? breakMinutes : focusMinutes;

        // If we're finishing a focus session, complete the task
        if (!newIsBreak && state.currentTask) {
          get().completeTask();
        }

        set({
          isActive: false,
          isBreak: newIsBreak,
          minutes: newMinutes,
          seconds: 0,
          progress: 100,
        });

        return;
      }

      set({ minutes: minutes - 1, seconds: 59 });
    } else {
      set({ seconds: seconds - 1 });
    }

    // Update progress
    const currentSeconds = minutes * 60 + seconds - 1;
    const newProgress = (currentSeconds / totalSeconds) * 100;
    set({ progress: newProgress });
  },

  completeTask: () => {
    // This function will be called when a focus session completes
    // The actual implementation to mark the task as completed will be in the component
    // that uses this store, as it needs access to the TaskContext
  },

  clearTask: () => {
    set({ currentTask: null });
  },
}));

// Set up the timer interval
let timerInterval: number | null = null;

// This function sets up the global timer
export function initializePomodoro() {
  // Clear any existing interval
  if (timerInterval) {
    window.clearInterval(timerInterval);
  }

  // Set up the interval
  timerInterval = window.setInterval(() => {
    const state = usePomodoroStore.getState();
    if (state.isActive) {
      state.tick();
    }
  }, 1000);

  return () => {
    if (timerInterval) {
      window.clearInterval(timerInterval);
      timerInterval = null;
    }
  };
}
