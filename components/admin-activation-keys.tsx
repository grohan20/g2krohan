"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Copy, Clock, Infinity, CheckCircle, XCircle, Users, Ban, UserCheck } from "lucide-react"
import { useFirebaseActivationKeys } from "@/hooks/use-firebase-activation-keys"
import { useFirebaseActivatedUsers } from "@/hooks/use-firebase-activated-users"

export function AdminActivationKeys() {
  const { keys, loading, addKey, deleteKey } = useFirebaseActivationKeys()
  const { users, loading: usersLoading, banUser, unbanUser } = useFirebaseActivatedUsers()

  const [activeTab, setActiveTab] = useState<"keys" | "users">("keys")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "1-time" as "1-time" | "unlimited",
    duration: "",
    keyMode: "random" as "custom" | "random",
    customKey: "",
  })

  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleAdd = async () => {
    if (!formData.duration || (formData.keyMode === "custom" && !formData.customKey)) return

    const keyToUse = formData.keyMode === "custom" ? formData.customKey : generateRandomKey()

    await addKey({
      key: keyToUse,
      type: formData.type,
      duration: formData.duration,
      createdAt: new Date(),
      usedCount: 0,
      isActive: true,
    })

    setFormData({ type: "1-time", duration: "", keyMode: "random", customKey: "" })
    setShowAddForm(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this activation key?")) {
      await deleteKey(id)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Activation key copied to clipboard!")
  }

  const formatDuration = (duration: string) => {
    if (duration === "NT") return "No Time Limit"
    const unit = duration.slice(-1)
    const value = duration.slice(0, -1)
    const units: { [key: string]: string } = {
      s: "seconds",
      m: "minutes",
      h: "hours",
      d: "days",
    }
    return `${value} ${units[unit] || "units"}`
  }

  const handleBanUser = async (userId: string) => {
    if (confirm("Are you sure you want to ban this user?")) {
      await banUser(userId)
    }
  }

  const handleUnbanUser = async (userId: string) => {
    if (confirm("Are you sure you want to unban this user?")) {
      await unbanUser(userId)
    }
  }

  const sortedKeys = [...keys].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const sortedUsers = [...users].sort((a, b) => new Date(b.activatedAt).getTime() - new Date(a.activatedAt).getTime())

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Card
          className={`cursor-pointer transition-all ${activeTab === "keys" ? "bg-[#00e0a4]/20 border-[#00e0a4]" : "bg-[#1a2340]/50 border-[#00e0a4]/20"}`}
          onClick={() => setActiveTab("keys")}
        >
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold text-white">Activation Key Management</h3>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${activeTab === "users" ? "bg-[#00e0a4]/20 border-[#00e0a4]" : "bg-[#1a2340]/50 border-[#00e0a4]/20"}`}
          onClick={() => setActiveTab("users")}
        >
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold text-white">Activated Users</h3>
          </CardContent>
        </Card>
      </div>

      {activeTab === "keys" ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Activation Key Management</h3>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80"
            >
              <Plus size={16} className="mr-2" />
              Create Key
            </Button>
          </div>

          {showAddForm && (
            <Card className="bg-[#1a2340]/50 border-[#00e0a4]/20">
              <CardHeader>
                <CardTitle className="text-white">Create New Activation Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="type" className="text-[#a6b1d8]">
                      Key Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "1-time" | "unlimited") => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2340] border-[#00e0a4]/30">
                        <SelectItem value="1-time" className="text-white">
                          1 Time Key
                        </SelectItem>
                        <SelectItem value="unlimited" className="text-white">
                          Unlimited Time Key
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-[#a6b1d8]">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                      placeholder="e.g., 1h, 1d, 7d, NT (No Time)"
                    />
                    <p className="text-xs text-[#a6b1d8] mt-1">Format: 1s, 1m, 1h, 1d or NT for no time limit</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="keyMode" className="text-[#a6b1d8]">
                    Key Mode
                  </Label>
                  <Select
                    value={formData.keyMode}
                    onValueChange={(value: "custom" | "random") =>
                      setFormData({ ...formData, keyMode: value, customKey: "" })
                    }
                  >
                    <SelectTrigger className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2340] border-[#00e0a4]/30">
                      <SelectItem value="custom" className="text-white">
                        Custom Key
                      </SelectItem>
                      <SelectItem value="random" className="text-white">
                        Random Key
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.keyMode === "custom" && (
                  <div>
                    <Label htmlFor="customKey" className="text-[#a6b1d8]">
                      Custom Key
                    </Label>
                    <Input
                      id="customKey"
                      value={formData.customKey}
                      onChange={(e) => setFormData({ ...formData, customKey: e.target.value })}
                      className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                      placeholder="Enter your custom activation key"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80"
                  >
                    <Plus size={16} className="mr-2" />
                    Create Key
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddForm(false)}
                    className="text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-[#a6b1d8]">Loading activation keys...</div>
              </div>
            ) : sortedKeys.length === 0 ? (
              <Card className="bg-[#1a2340]/50 border-[#00e0a4]/20">
                <CardContent className="text-center py-8">
                  <p className="text-[#a6b1d8]">No Activation Keys Created</p>
                </CardContent>
              </Card>
            ) : (
              sortedKeys.map((key) => (
                <Card key={key.id} className="bg-[#1a2340]/50 border-[#00e0a4]/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-lg font-mono text-[#00e0a4] bg-[#1a2340]/50 px-3 py-1 rounded">
                            {key.key}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.key)}
                            className="text-[#a6b1d8] hover:bg-white/10"
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                        <div className="grid gap-2 md:grid-cols-4 text-sm text-[#a6b1d8]">
                          <div className="flex items-center gap-2">
                            {key.type === "unlimited" ? <Infinity size={14} /> : <Clock size={14} />}
                            <span className="capitalize">{key.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>{formatDuration(key.duration)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Used: {key.usedCount} times</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {key.isActive ? (
                              <CheckCircle size={14} className="text-[#00e0a4]" />
                            ) : (
                              <XCircle size={14} className="text-[#ff4d6d]" />
                            )}
                            <span>{key.isActive ? "Active" : "Expired"}</span>
                          </div>
                        </div>
                        <div className="text-xs text-[#a6b1d8] mt-2">
                          Created: {key.createdAt.toLocaleDateString()} {key.createdAt.toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(key.id)}
                          className="text-[#ff4d6d] hover:bg-[#ff4d6d]/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Activated Users</h3>
          </div>

          <div className="space-y-4">
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="text-[#a6b1d8]">Loading activated users...</div>
              </div>
            ) : sortedUsers.length === 0 ? (
              <Card className="bg-[#1a2340]/50 border-[#00e0a4]/20">
                <CardContent className="text-center py-8">
                  <p className="text-[#a6b1d8]">No Users Activated</p>
                </CardContent>
              </Card>
            ) : (
              sortedUsers.map((user) => (
                <Card key={user.id} className="bg-[#1a2340]/50 border-[#00e0a4]/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Users size={20} className="text-[#00e0a4]" />
                          <span className="text-lg font-semibold text-white">{user.name}</span>
                          {user.isBanned && (
                            <span className="bg-[#ff4d6d] text-white px-2 py-1 rounded text-xs">BANNED</span>
                          )}
                        </div>
                        <div className="grid gap-2 md:grid-cols-2 text-sm text-[#a6b1d8]">
                          <div>
                            <span className="font-medium">Activation Key: </span>
                            <code className="text-[#00e0a4]">{user.activationKey}</code>
                          </div>
                          <div>
                            <span className="font-medium">Activated: </span>
                            <span>
                              {user.activatedAt.toLocaleDateString()} {user.activatedAt.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {user.isBanned ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnbanUser(user.id)}
                            className="text-[#00e0a4] hover:bg-[#00e0a4]/20"
                          >
                            <UserCheck size={16} className="mr-1" />
                            Unban
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBanUser(user.id)}
                            className="text-[#ff4d6d] hover:bg-[#ff4d6d]/20"
                          >
                            <Ban size={16} className="mr-1" />
                            Ban
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
