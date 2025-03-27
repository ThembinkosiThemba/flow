"use client"

import type React from "react"

import { useState } from "react"
import { useTasks } from "@/context/TaskContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

interface TaskFormProps {
  disabled?: boolean
}

export default function TaskForm({ disabled = false }: TaskFormProps) {
  const { addTask } = useTasks()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("main")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={disabled}
              required
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
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority} disabled={disabled}>
              <SelectTrigger id="priority">
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
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={disabled || !title.trim()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

