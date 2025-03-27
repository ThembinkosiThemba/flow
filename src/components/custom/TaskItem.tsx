"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Clock, MoreVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTasks, type Task } from "@/context/TaskContext";
import PomodoroModal from "./Pomodoro";
import { usePomodoroStore } from "./PomodoroManager";

interface TaskListProps {
  tasks: Task[];
  priority: "main" | "secondary" | "backlog";
}

export default function TaskList({ tasks, priority }: TaskListProps) {
  const { updateTask, deleteTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const { currentTask } = usePomodoroStore();

  const handleCheckboxChange = (task: Task) => {
    updateTask({
      ...task,
      completed: !task.completed,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const openPomodoro = (task: Task) => {
    setSelectedTask(task);
    setIsPomodoroOpen(true);
  };

  // Separate completed and incomplete tasks
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  // Check if a task has an active pomodoro
  const isTaskActive = (task: Task) => {
    return currentTask?.id === task.id;
  };

  return (
    <div className="space-y-4">
      {/* Incomplete tasks */}
      <div className="space-y-2">
        {incompleteTasks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
            <p>No {priority} tasks</p>
          </div>
        ) : (
          incompleteTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isTaskActive(task)
                  ? "border-primary bg-primary/5 animate-pulse"
                  : "border-border"
              } transition-all hover:border-primary/50`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleCheckboxChange(task)}
                  className="transition-transform hover:scale-110"
                />
                <span className="truncate font-medium">{task.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openPomodoro(task)}
                  className={`h-8 w-8 transition-transform hover:scale-110 ${
                    isTaskActive(task) ? "text-primary" : ""
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span className="sr-only">Start Pomodoro</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed tasks - only show if there are any */}
      {completedTasks.length > 0 && (
        <>
          <div className="flex items-center gap-2 pt-4">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs font-medium text-muted-foreground">
              Completed
            </span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <div className="space-y-2 opacity-70">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border transition-all hover:border-primary/50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleCheckboxChange(task)}
                    className="transition-transform hover:scale-110"
                  />
                  <span className="truncate font-medium line-through">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedTask && (
        <PomodoroModal
          open={isPomodoroOpen}
          onOpenChange={setIsPomodoroOpen}
          task={selectedTask}
        />
      )}
    </div>
  );
}
