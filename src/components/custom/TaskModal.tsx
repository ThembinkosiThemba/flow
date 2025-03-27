"use client"

import type React from "react"

import { useState } from "react"
import { useTasks } from "@/context/TaskContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disabled?: boolean
}

export default function TaskModal({ open, onOpenChange, disabled = false }: TaskModalProps) {
  const { addTask } = useTasks()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<string>("main")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (!["main", "secondary", "backlog"].includes(priority)) return;

    addTask({
      id: Date.now().toString(),
      title,
      description,
      priority,
      completed: false,
    })

    setTitle("")
    setDescription("")
    setPriority("main")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task to track your work. Press save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={disabled}
                required
                className=""
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={disabled}
                rows={3}
                className="paper-light paper-dark"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={disabled}>
                <SelectTrigger id="priority" className="paper-light paper-dark">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="backlog" disabled={disabled}>
                    Backlog
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={disabled || !title.trim()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

