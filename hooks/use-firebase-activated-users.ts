"use client"

import { useState, useEffect } from "react"
import { ref, push, onValue, update } from "firebase/database"
import { database } from "@/lib/firebase"

export interface ActivatedUser {
  id: string
  name: string
  activationKey: string
  activatedAt: Date
  isBanned: boolean
}

export function useFirebaseActivatedUsers() {
  const [users, setUsers] = useState<ActivatedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const usersRef = ref(database, "activatedUsers")

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const usersList = Object.entries(data).map(([id, user]: [string, any]) => ({
          id,
          name: user.name,
          activationKey: user.activationKey,
          activatedAt: new Date(user.activatedAt),
          isBanned: user.isBanned || false,
        }))
        setUsers(usersList)
        console.log("[v0] Loaded activated users from Firebase:", usersList.length)
      } else {
        setUsers([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addUser = async (userData: Omit<ActivatedUser, "id">) => {
    try {
      const usersRef = ref(database, "activatedUsers")
      await push(usersRef, {
        ...userData,
        activatedAt: userData.activatedAt.toISOString(),
      })
      console.log("[v0] User added to Firebase:", userData.name)
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  const banUser = async (id: string) => {
    try {
      const userRef = ref(database, `activatedUsers/${id}`)
      await update(userRef, { isBanned: true })
    } catch (error) {
      console.error("Error banning user:", error)
    }
  }

  const unbanUser = async (id: string) => {
    try {
      const userRef = ref(database, `activatedUsers/${id}`)
      await update(userRef, { isBanned: false })
    } catch (error) {
      console.error("Error unbanning user:", error)
    }
  }

  const checkUserStatus = (name: string, key: string) => {
    console.log("[v0] Checking user status for:", name, key)
    console.log("[v0] Available users:", users.length)

    if (!name || !key) {
      console.log("[v0] Invalid name or key provided")
      return null
    }

    const user = users.find((user) => user.name === name && user.activationKey === key)
    console.log("[v0] Found user:", user ? `${user.name} (banned: ${user.isBanned})` : "not found")

    return user
  }

  return {
    users,
    loading,
    addUser,
    banUser,
    unbanUser,
    checkUserStatus,
  }
}
