"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"
import { LogIn, UserPlus, UserRound, ListTodo, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/custom/theme-toggle"

interface AuthPageProps {
  onLogin: () => void
  onGuestMode: () => void
}

export default function AuthPage({ onLogin, onGuestMode }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState("login")
  // const { toast } = useToast()
  const location = useLocation()

  // Check if guest parameter is in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get("guest") === "true") {
      handleGuestMode()
    }
  }, [location])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate credentials here
    // toast({
    //   title: "Logged in successfully",
    //   description: "Welcome back to your task manager!",
    // })
    onLogin()
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // toast({
    //   title: "Account created successfully",
    //   description: "Your account has been created and you're now logged in.",
    // })
    onLogin()
  }

  const handleGuestMode = () => {
    // toast({
    //   title: "Guest mode activated",
    //   description: "You're now using the app in guest mode. Some features will be limited.",
    // })
    onGuestMode()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-primary" />
              <span className="font-bold">TaskFlow</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center flex-1 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to TaskFlow</CardTitle>
            <CardDescription className="text-center">Sign in to your account or continue as guest</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="your@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleGuestMode}>
              <UserRound className="mr-2 h-4 w-4" /> Continue as Guest
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

