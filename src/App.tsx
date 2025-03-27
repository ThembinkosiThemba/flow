"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import AuthPage from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import { ThemeProvider } from "./context/ThemeProvider"
// import { Toaster } from "./components/ui/toaster"
import { TaskProvider } from "./context/TaskContext"
import "./grid.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isGuest, setIsGuest] = useState<boolean>(false)

  // Check for existing auth state in localStorage
  useEffect(() => {
    const savedAuthState = localStorage.getItem("authState")
    if (savedAuthState) {
      const { isAuthenticated: savedAuth, isGuest: savedGuest } = JSON.parse(savedAuthState)
      setIsAuthenticated(savedAuth)
      setIsGuest(savedGuest)
    }
  }, [])

  // Save auth state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify({ isAuthenticated, isGuest }))
  }, [isAuthenticated, isGuest])

  const handleLogin = () => {
    setIsAuthenticated(true)
    setIsGuest(false)
  }

  const handleGuestMode = () => {
    setIsGuest(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsGuest(false)
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="taskflow-theme">
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/auth"
              element={
                !isAuthenticated && !isGuest ? (
                  <AuthPage onLogin={handleLogin} onGuestMode={handleGuestMode} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated || isGuest ? (
                  <Dashboard isGuest={isGuest} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
          </Routes>
        </Router>
        {/* <Toaster /> */}
      </TaskProvider>
    </ThemeProvider>
  )
}

export default App

