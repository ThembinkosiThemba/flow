"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/custom/theme-toggle";
import {
  CheckCircle,
  Clock,
  ListTodo,
  UserRound,
  Zap,
  CheckCheck,
  Calendar,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Play,
  Plus,
  MousePointer,
  MousePointerClick,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [activeSection, setActiveSection] = useState("features");
  const [isHeroAnimated, setIsHeroAnimated] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoActive, setDemoActive] = useState(false);
  const [demoTime, setDemoTime] = useState("25:00");
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [demoTasks, setDemoTasks] = useState([
    { id: 1, title: "Create a new project", completed: false },
    { id: 2, title: "Design the landing page", completed: false },
    { id: 3, title: "Implement the dashboard", completed: false },
  ]);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Trigger hero animation when page loads or on scroll to top
      if (scrollTop < 100) {
        setIsHeroAnimated(true);
      }
    };

    // Set hero animation on initial load
    setIsHeroAnimated(true);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Demo Pomodoro timer functionality
  const startDemoTimer = () => {
    if (demoActive) return;

    setDemoActive(true);
    setDemoProgress(100);

    let seconds = 1500; // 25 minutes in seconds

    demoIntervalRef.current = setInterval(() => {
      seconds -= 1;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      setDemoTime(
        `${minutes.toString().padStart(2, "0")}:${remainingSeconds
          .toString()
          .padStart(2, "0")}`
      );

      const progressValue = (seconds / 1500) * 100;
      setDemoProgress(progressValue);

      if (seconds <= 0) {
        clearInterval(demoIntervalRef.current!);
        setDemoActive(false);
        setDemoTime("25:00");
        setDemoProgress(100);

        // Mark a random task as completed
        const incompleteTasks = demoTasks.filter((t) => !t.completed);
        if (incompleteTasks.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * incompleteTasks.length
          );
          const taskToComplete = incompleteTasks[randomIndex];

          setDemoTasks(
            demoTasks.map((task) =>
              task.id === taskToComplete.id
                ? { ...task, completed: true }
                : task
            )
          );
        }
      }
    }, 50); // Speed up for demo purposes (50ms instead of 1000ms)

    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  };

  const resetDemoTimer = () => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
    }
    setDemoActive(false);
    setDemoTime("25:00");
    setDemoProgress(100);
  };

  const addDemoTask = () => {
    const newTask = {
      id: demoTasks.length + 1,
      title: `New task ${demoTasks.length + 1}`,
      completed: false,
    };
    setDemoTasks([...demoTasks, newTask]);
  };

  const toggleDemoTask = (id: number) => {
    setDemoTasks(
      demoTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative mx-16">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-xl font-bold">Flow</span>
          </div>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              onClick={() => setActiveSection("features")}
              className={`text-sm font-medium transition-all duration-300 border-b-2 pb-1 ${
                activeSection === "features"
                  ? "border-primary text-primary"
                  : "border-transparent hover:text-primary hover:border-primary/50"
              }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setActiveSection("how-it-works")}
              className={`text-sm font-medium transition-all duration-300 border-b-2 pb-1 ${
                activeSection === "how-it-works"
                  ? "border-primary text-primary"
                  : "border-transparent hover:text-primary hover:border-primary/50"
              }`}
            >
              How It Works
            </a>
            <a
              href="#faq"
              onClick={() => setActiveSection("faq")}
              className={`text-sm font-medium transition-all duration-300 border-b-2 pb-1 ${
                activeSection === "faq"
                  ? "border-primary text-primary"
                  : "border-transparent hover:text-primary hover:border-primary/50"
              }`}
            >
              FAQ
            </a>
          </nav> */}

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex transition-all hover:scale-105"
              >
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="sm"
                className="transition-all hover:scale-105 active:scale-95"
              >
                Get Started
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fadeIn">
            {/* <nav className="container flex flex-col py-4 px-4">
              <a
                href="#features"
                onClick={() => {
                  setActiveSection("features");
                  setIsMenuOpen(false);
                }}
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => {
                  setActiveSection("how-it-works");
                  setIsMenuOpen(false);
                }}
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#faq"
                onClick={() => {
                  setActiveSection("faq");
                  setIsMenuOpen(false);
                }}
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                FAQ
              </a>
            </nav> */}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-[0.03]"></div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div
              className={`flex flex-col justify-center space-y-8 transition-all duration-1000 ${
                isHeroAnimated
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 animate-bounce">
                  <span className="text-xs bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center mr-1">
                    ✓
                  </span>
                  Simple task management for busy people
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  A glorified{" "}
                  <span className="text-primary relative">
                    Todo App
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 animate-pulse"></span>
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  Flow helps you organize your quick tasks with a
                  distraction-free interface. No unnecessary complexity
                  included.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="px-8 transition-all hover:scale-105 active:scale-95 group"
                  >
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/auth?guest=true">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 transition-all hover:scale-105 active:scale-95 group"
                  >
                    <UserRound className="mr-2 h-4 w-4" />
                    Try Guest Mode
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Free forever plan</span>
                </div>
              </div>
            </div>

            {/* Interactive Demo */}
            <div
              className={`relative lg:ml-auto transition-all duration-1000 delay-300 ${
                isHeroAnimated
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="relative mx-auto w-full max-w-[500px] group">
                <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-background shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                  <div className="bg-primary/10 h-8 w-full flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-xs text-muted-foreground ml-2">
                      Flow Dashboard
                    </div>
                  </div>

                  {/* Interactive Demo Content */}
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">My Tasks</h3>
                        <Button
                          size="sm"
                          onClick={addDemoTask}
                          className="transition-all hover:scale-105 active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
                        </Button>
                      </div>

                      {/* Demo Pomodoro Timer */}
                      <div className="bg-muted/40 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              Pomodoro Timer
                            </span>
                          </div>
                          <span className="font-mono text-lg">{demoTime}</span>
                        </div>
                        <Progress value={demoProgress} className="h-1.5 mb-2" />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetDemoTimer}
                            className="h-7 px-2 text-xs"
                          >
                            Reset
                          </Button>
                          <Button
                            size="sm"
                            onClick={startDemoTimer}
                            disabled={demoActive}
                            className="h-7 px-2 text-xs transition-all hover:scale-105 active:scale-95"
                          >
                            <Play className="h-3 w-3 mr-1" /> Start
                          </Button>
                        </div>
                      </div>

                      {/* Demo Task List */}
                      <div className="space-y-2 max-h-[200px] overflow-auto">
                        {demoTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-center p-2 rounded-md border ${
                              task.completed ? "opacity-60" : ""
                            } transition-all hover:border-primary/50 cursor-pointer group/task`}
                            onClick={() => toggleDemoTask(task.id)}
                          >
                            <div
                              className={`w-4 h-4 rounded-sm border mr-3 flex items-center justify-center transition-colors ${
                                task.completed
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-primary"
                              }`}
                            >
                              {task.completed && (
                                <CheckCheck className="h-3 w-3" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                task.completed ? "line-through" : ""
                              }`}
                            >
                              {task.title}
                            </span>
                            <MousePointerClick className="h-3 w-3 ml-auto opacity-0 group-hover/task:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      {/* Add Task Hint */}
                      {demoTasks.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                          <p className="text-sm">
                            Click "Add Task" to create your first task
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-lg bg-primary/20 blur-2xl"></div>
                <div className="absolute -top-6 -left-6 h-24 w-24 rounded-lg bg-primary/20 blur-2xl"></div>

                {/* Interactive cursor hint */}
                <div className="absolute -bottom-10 right-0 text-xs text-muted-foreground flex items-center animate-bounce">
                  <MousePointer className="h-3 w-3 mr-1" />
                  <span>Try the interactive demo!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-4">
              FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
              Everything you need, nothing you don't
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30"></span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Get rid of those many Jira or Notion features and complexity you
              don't need, with just the right features you can start without
              feeling overwhelmed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background border-2 border-muted group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  Priority-Based Tasks
                </h3>
                <p className="text-muted-foreground">
                  Organize your tasks by priority level - main, secondary, and
                  backlog to stay focused on what matters most.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-2 border-muted group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  Pomodoro Timer
                </h3>
                <p className="text-muted-foreground">
                  Boost productivity with built-in Pomodoro timers for each task
                  or use the global timer for focused work sessions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-2 border-muted group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  Distraction-Free UI
                </h3>
                <p className="text-muted-foreground">
                  Clean, minimal interface designed to help you focus on your
                  tasks without unnecessary distractions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-2 border-muted group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  Task Completion
                </h3>
                <p className="text-muted-foreground">
                  Mark tasks as complete and track your progress by just simple
                  clicks. Tasks are automatically completed after Pomodoro
                  sessions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-2 border-muted group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  Guest Mode
                </h3>
                <p className="text-muted-foreground">
                  Try the app instantly with Guest Mode - no signup required.
                  Perfect for quick task management sessions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-2 border-muted group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  Task Statistics
                </h3>
                <p className="text-muted-foreground">
                  Get a quick overview of your task completion rate and
                  productivity metrics at a glance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
              Simple steps to boost your productivity
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30"></span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Flow is designed to be intuitive and easy to use. Here's how to
              get started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="relative z-10 group">
              <div className="bg-background p-4 rounded-full w-12 h-12 flex items-center justify-center border-2 border-primary mx-auto mb-6 text-primary font-bold group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="text-center space-y-3 p-6 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-all">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  Click guest mode
                </h3>
                <p className="text-muted-foreground">
                  Use the guest mode to get started immediately without
                  registration.
                </p>
                <Link to="/auth?guest=true" className="inline-block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Guest Mode
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10 group">
              <div className="bg-background p-4 rounded-full w-12 h-12 flex items-center justify-center border-2 border-primary mx-auto mb-6 text-primary font-bold group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="text-center space-y-3 p-6 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-all">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  Add your tasks
                </h3>
                <p className="text-muted-foreground">
                  Create tasks and organize them by priority - main tasks,
                  secondary tasks, and backlog items.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={addDemoTask}
                >
                  <Plus className="h-4 w-4 mr-1" /> Try Adding a Task
                </Button>
              </div>
            </div>

            <div className="relative z-10 group">
              <div className="bg-background p-4 rounded-full w-12 h-12 flex items-center justify-center border-2 border-primary mx-auto mb-6 text-primary font-bold group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="text-center space-y-3 p-6 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-all">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  Focus and complete
                </h3>
                <p className="text-muted-foreground">
                  Use the Pomodoro timer to stay focused, complete tasks, and
                  track your progress.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={startDemoTimer}
                  disabled={demoActive}
                >
                  <Play className="h-4 w-4 mr-1" /> Try Pomodoro
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to="/auth">
              <Button
                size="lg"
                className="group transition-all hover:scale-105 active:scale-95"
              >
                Get Started Now
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-4">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
              Frequently asked questions
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30"></span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about Flow
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="group">
              <AccordionTrigger className="group-hover:text-primary transition-colors">
                Is Flow completely free to use?
              </AccordionTrigger>
              <AccordionContent className="animate-fadeIn">
                Yes, Flow offers a completely free plan that includes all the
                essential features for personal task management. We also offer
                premium plans with additional features for power users and
                teams.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="group">
              <AccordionTrigger className="group-hover:text-primary transition-colors">
                What is Guest Mode?
              </AccordionTrigger>
              <AccordionContent className="animate-fadeIn">
                Guest Mode allows you to use Flow without creating an account.
                It's perfect for quick task management sessions. However, your
                data won't be saved between sessions, and some features like
                backlog management are limited to registered users.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="group">
              <AccordionTrigger className="group-hover:text-primary transition-colors">
                How does the Pomodoro timer work?
              </AccordionTrigger>
              <AccordionContent className="animate-fadeIn">
                The Pomodoro timer is based on the Pomodoro Technique, a time
                management method that uses a timer to break work into
                intervals, traditionally 25 minutes in length, separated by
                short breaks. Flow offers both a global timer and individual
                task timers to help you stay focused.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="group">
              <AccordionTrigger className="group-hover:text-primary transition-colors">
                Can I use Flow on mobile devices?
              </AccordionTrigger>
              <AccordionContent className="animate-fadeIn">
                Yes, Flow is fully responsive and works on all devices,
                including smartphones and tablets. We're also working on native
                mobile apps that will be available soon.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="group">
              <AccordionTrigger className="group-hover:text-primary transition-colors">
                Is my data secure?
              </AccordionTrigger>
              <AccordionContent className="animate-fadeIn">
                Yes, we take data security seriously. All data is encrypted in
                transit and at rest. We never share your personal information
                with third parties, and you can delete your account and all
                associated data at any time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-[0.03]"></div>

        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            Ready to simplify your task management?
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30"></span>
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Ditch the excessive tools and use something simple with Flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button
                size="lg"
                className="px-8 transition-all hover:scale-105 active:scale-95 group"
              >
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/auth?guest=true">
              <Button
                size="lg"
                variant="outline"
                className="px-8 transition-all hover:scale-105 active:scale-95"
              >
                Try Guest Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 justify-center items-center md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ListTodo className="h-5 w-5 text-primary" />
                <span className="font-bold">Flow</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Simple task management for busy people.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Flow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
