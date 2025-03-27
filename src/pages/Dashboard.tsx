"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, ListTodo, Clock } from "lucide-react";
import TaskList from "@/components/custom/TaskItem";
import { useTasks } from "../context/TaskContext";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import TaskModal from "@/components/custom/TaskModal";
import { usePomodoroStore } from "@/components/custom/PomodoroManager";
import PomodoroModal from "@/components/custom/Pomodoro";

interface DashboardProps {
  isGuest: boolean;
  onLogout: () => void;
}

export default function Dashboard({ isGuest, onLogout }: DashboardProps) {
  const { tasks } = useTasks();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "main" | "secondary" | "backlog"
  >("main");
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  const { currentTask, isActive, minutes, seconds } = usePomodoroStore();

  const mainTasks = tasks.filter((task) => task.priority === "main");
  const secondaryTasks = tasks.filter((task) => task.priority === "secondary");
  const backlogTasks = tasks.filter((task) => task.priority === "backlog");

  // Format time for the mini timer
  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen paper-texture">
      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        disabled={isGuest && false}
      />

      {/* Render the pomodoro modal if there's an active task */}
      {currentTask && (
        <PomodoroModal
          open={isPomodoroOpen}
          onOpenChange={setIsPomodoroOpen}
          task={currentTask}
        />
      )}

      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Flow</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Mini timer that shows when a pomodoro is active */}
            {currentTask && isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPomodoroOpen(true)}
                className="gap-2 animate-pulse transition-transform hover:scale-105"
              >
                <Clock className="h-3.5 w-3.5" />
                <span className="font-mono text-xs">
                  {formatTime(minutes, seconds)}
                </span>
              </Button>
            )}

            <ThemeToggle />
            {isGuest && (
              <span className="text-xs font-medium px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full animate-pulse">
                Guest
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="transition-all hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:px-6 md:py-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <Button
            onClick={() => setIsTaskModalOpen(true)}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>

        <div className="p-4 md:p-6 rounded-lg">
          {/* Subtle filter buttons */}
          <div className="flex space-x-2 mb-6 border-b pb-2">
            <button
              onClick={() => setActiveFilter("main")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeFilter === "main"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Main
            </button>
            <button
              onClick={() => setActiveFilter("secondary")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeFilter === "secondary"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Secondary
            </button>
            <button
              onClick={() => setActiveFilter("backlog")}
              disabled={isGuest}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeFilter === "backlog"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              } ${isGuest ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Backlog
            </button>
          </div>

          {/* Task content with animations */}
          <div className="transition-all duration-300 ease-in-out">
            {activeFilter === "main" && (
              <div className="animate-fadeIn">
                <TaskList tasks={mainTasks} priority="main" />
              </div>
            )}

            {activeFilter === "secondary" && (
              <div className="animate-fadeIn">
                <TaskList tasks={secondaryTasks} priority="secondary" />
              </div>
            )}

            {activeFilter === "backlog" && (
              <div className="animate-fadeIn">
                {isGuest ? (
                  <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg animate-pulse">
                    <p className="font-medium">
                      Backlog is not available in guest mode
                    </p>
                    <p className="text-sm mt-2">
                      Sign up to access all features
                    </p>
                  </div>
                ) : (
                  <TaskList tasks={backlogTasks} priority="backlog" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Task statistics with animation */}
        <div className="mt-6 text-sm text-muted-foreground text-center transition-opacity duration-300 hover:opacity-100 opacity-70">
          <p>
            {tasks.length} total tasks •{" "}
            {tasks.filter((t) => t.completed).length} completed •{" "}
            {tasks.filter((t) => !t.completed).length} pending
          </p>
        </div>
      </main>
    </div>
  );
}
