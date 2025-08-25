"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { TradingBackground } from "@/components/trading-background"
import { AdminReviewManager } from "@/components/admin-review-manager"
import { AdminBrokerManager } from "@/components/admin-broker-manager"
import { AdminActivationKeys } from "@/components/admin-activation-keys"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, MessageSquare, Building, Key, Lock } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "G2K" && password === "ROHAN") {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuthenticated", "true")
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuthenticated")
    setUsername("")
    setPassword("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <TradingBackground />

        <Card className="w-full max-w-md mx-4 bg-[#1a2340]/90 border-[#00e0a4]/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock size={32} className="text-[#ff4d6d]" />
              <CardTitle className="text-2xl gradient-text">Admin Login</CardTitle>
            </div>
            <CardDescription className="text-[#a6b1d8]">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#0f1629] border-[#00e0a4]/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#0f1629] border-[#00e0a4]/20 text-white"
                  required
                />
              </div>
              {error && <p className="text-[#ff4d6d] text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:opacity-90">
                Login
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/">
                <Button variant="ghost" className="text-[#a6b1d8] hover:bg-white/10">
                  Back to Site
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <TradingBackground />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LT</span>
          </div>
          <h1 className="text-xl font-bold gradient-text">LumenTrade Admin</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button onClick={handleLogout} variant="ghost" className="text-[#ff4d6d] hover:bg-[#ff4d6d]/10">
            Logout
          </Button>
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Back to Site
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Admin Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield size={32} className="text-[#ff4d6d]" />
              <h2 className="text-2xl md:text-4xl font-bold gradient-text">Admin Panel</h2>
            </div>
            <p className="text-[#a6b1d8]">Manage your LumenTrade platform</p>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#1a2340]/50 border border-[#00e0a4]/20">
              <TabsTrigger
                value="reviews"
                className="flex items-center gap-2 data-[state=active]:bg-[#00e0a4]/20 data-[state=active]:text-[#00e0a4]"
              >
                <MessageSquare size={16} />
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="brokers"
                className="flex items-center gap-2 data-[state=active]:bg-[#00e0a4]/20 data-[state=active]:text-[#00e0a4]"
              >
                <Building size={16} />
                Brokers
              </TabsTrigger>
              <TabsTrigger
                value="activation"
                className="flex items-center gap-2 data-[state=active]:bg-[#00e0a4]/20 data-[state=active]:text-[#00e0a4]"
              >
                <Key size={16} />
                Activation Keys
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-6">
              <AdminReviewManager />
            </TabsContent>

            <TabsContent value="brokers" className="mt-6">
              <AdminBrokerManager />
            </TabsContent>

            <TabsContent value="activation" className="mt-6">
              <AdminActivationKeys />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
