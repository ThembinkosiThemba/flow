"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Coffee, Bell, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { Task } from "@/context/TaskContext";
import { useTasks } from "@/context/TaskContext";
import { usePomodoroStore, initializePomodoro } from "./PomodoroManager";

interface PomodoroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export default function PomodoroModal({
  open,
  onOpenChange,
  task,
}: PomodoroModalProps) {
  const { updateTask } = useTasks();
  const {
    focusMinutes,
    breakMinutes,
    minutes,
    seconds,
    isActive,
    isBreak,
    progress,
    currentTask,
    setFocusMinutes,
    setBreakMinutes,
    startTimer,
    pauseTimer,
    resetTimer,
  } = usePomodoroStore();

  const [activeSection, setActiveSection] = useState<"timer" | "settings">(
    "timer"
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the global timer on component mount
  useEffect(() => {
    const cleanup = initializePomodoro();
    return cleanup;
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3"
    );

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play sound when timer completes
  useEffect(() => {
    // If the timer just stopped and we're switching modes, play the sound
    if (
      !isActive &&
      ((isBreak && minutes === breakMinutes) ||
        (!isBreak && minutes === focusMinutes))
    ) {
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing sound:", e));
      }
    }
  }, [isActive, isBreak, minutes, focusMinutes, breakMinutes]);

  // Set up task completion handler
  useEffect(() => {
    // Override the completeTask function in the store
    const originalCompleteTask = usePomodoroStore.getState().completeTask;

    usePomodoroStore.setState({
      completeTask: () => {
        // Call the original function first
        originalCompleteTask();

        // Get the current task
        const taskToComplete = usePomodoroStore.getState().currentTask;

        // Mark the task as completed
        if (taskToComplete && !taskToComplete.completed) {
          updateTask({
            ...taskToComplete,
            completed: true,
          });
        }
      },
    });
  }, [updateTask]);

  const toggleTimer = () => {
    if (isActive) {
      pauseTimer();
    } else {
      startTimer(task);
    }
  };

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFocusChange = (value: number[]) => {
    setFocusMinutes(value[0]);
  };

  const handleBreakChange = (value: number[]) => {
    setBreakMinutes(value[0]);
  };

  // Check if this task is the current task
  const isCurrentTask = currentTask?.id === task.id;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen && isActive && isCurrentTask) {
          if (
            confirm("Timer is still running. Are you sure you want to close?")
          ) {
            onOpenChange(newOpen);
          }
        } else {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isBreak ? "Break Time" : "Focus Time"} - {task.title}
          </DialogTitle>
        </DialogHeader>

        {/* Navigation similar to dashboard */}
        <div className="flex space-x-2 mb-6 border-b pb-2">
          <button
            onClick={() => setActiveSection("timer")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeSection === "timer"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeSection === "settings"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Settings
          </button>
        </div>

        {activeSection === "timer" && (
          <div className="space-y-4 py-4 animate-fadeIn">
            <div className="flex items-center justify-center">
              <div
                className={`p-2 rounded-full ${
                  isBreak
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "bg-red-100 dark:bg-red-900"
                }`}
              >
                {isBreak ? (
                  <Coffee
                    className={`h-5 w-5 ${
                      isBreak
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                ) : (
                  <Play
                    className={`h-5 w-5 ${
                      isBreak
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                )}
              </div>
              <span className="ml-2 font-medium">
                {isBreak ? "Break Time" : "Focus Time"}
              </span>
            </div>

            <div className="text-center">
              <div className="text-5xl font-mono font-bold">
                {formatTime(minutes, seconds)}
              </div>
            </div>

            <Progress value={progress} className="h-2" />

            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleTimer}
                className="w-24 transition-transform hover:scale-105 active:scale-95"
                disabled={
                  isActive && currentTask && currentTask.id !== task.id
                    ? true
                    : undefined
                }
              >
                {isActive && isCurrentTask ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Start
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={resetTimer}
                className="w-24 transition-transform hover:scale-105 active:scale-95"
                disabled={
                  isActive && currentTask && currentTask.id !== task.id
                    ? true
                    : undefined
                }
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>

            {currentTask && currentTask.id !== task.id && (
              <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md text-sm text-amber-800 dark:text-amber-200 animate-pulse">
                <p className="font-medium">
                  Another task is currently in progress: "{currentTask.title}"
                </p>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>
                Focus: {focusMinutes} min • Break: {breakMinutes} min
              </p>
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="space-y-6 py-4 animate-fadeIn">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="focus-time">
                  Focus Time: {focusMinutes} minutes
                </Label>
              </div>
              <Slider
                id="focus-time"
                defaultValue={[focusMinutes]}
                max={60}
                min={5}
                step={5}
                onValueChange={handleFocusChange}
                disabled={isActive && !isBreak}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="break-time">
                  Break Time: {breakMinutes} minutes
                </Label>
              </div>
              <Slider
                id="break-time"
                defaultValue={[breakMinutes]}
                max={30}
                min={1}
                step={1}
                onValueChange={handleBreakChange}
                disabled={isActive && isBreak}
              />
            </div>

            <div className="bg-muted p-3 rounded-md text-sm">
              <h4 className="font-medium mb-2 flex items-center">
                <Bell className="h-4 w-4 mr-2" /> Sound Notification
              </h4>
              <p className="text-muted-foreground">
                A sound will play when the timer ends. Make sure your volume is
                turned on.
              </p>
            </div>

            <div className="bg-muted p-3 rounded-md text-sm">
              <h4 className="font-medium mb-2 flex items-center">
                <Check className="h-4 w-4 mr-2" /> Task Completion
              </h4>
              <p className="text-muted-foreground">
                Tasks will be automatically marked as completed when a focus
                session ends.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
