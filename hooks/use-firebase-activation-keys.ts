"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, push, set, remove } from "firebase/database"

export interface ActivationKey {
  id: string
  key: string
  type: "1-time" | "unlimited"
  duration: string
  createdAt: Date
  usedCount: number
  isActive: boolean
}

export function useFirebaseActivationKeys() {
  const [keys, setKeys] = useState<ActivationKey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const keysRef = ref(database, "activationKeys")

    const unsubscribe = onValue(keysRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const keysArray = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
          createdAt: new Date(value.createdAt),
        }))
        setKeys(keysArray)
      } else {
        setKeys([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addKey = async (keyData: Omit<ActivationKey, "id">) => {
    const keysRef = ref(database, "activationKeys")
    await push(keysRef, {
      ...keyData,
      createdAt: keyData.createdAt.toISOString(),
    })
  }

  const updateKey = async (id: string, keyData: Omit<ActivationKey, "id">) => {
    const keyRef = ref(database, `activationKeys/${id}`)
    await set(keyRef, {
      ...keyData,
      createdAt: keyData.createdAt.toISOString(),
    })
  }

  const deleteKey = async (id: string) => {
    const keyRef = ref(database, `activationKeys/${id}`)
    await remove(keyRef)
  }

  const validateKey = async (inputKey: string): Promise<boolean> => {
    try {
      const keysRef = ref(database, "activationKeys")
      const snapshot = await new Promise((resolve) => {
        onValue(keysRef, resolve, { onlyOnce: true })
      })

      const data = (snapshot as any).val()
      if (!data) return false

      const keysArray = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        ...value,
        createdAt: new Date(value.createdAt),
      }))

      const foundKey = keysArray.find((key) => key.key.toLowerCase() === inputKey.toLowerCase() && key.isActive)

      if (foundKey) {
        // Update usage count for 1-time keys
        if (foundKey.type === "1-time") {
          await updateKey(foundKey.id, {
            ...foundKey,
            usedCount: foundKey.usedCount + 1,
            isActive: false, // Deactivate after first use
          })
        } else {
          // Update usage count for unlimited keys
          await updateKey(foundKey.id, {
            ...foundKey,
            usedCount: foundKey.usedCount + 1,
          })
        }
        return true
      }

      return false
    } catch (error) {
      console.error("Error validating key:", error)
      return false
    }
  }

  return {
    keys,
    loading,
    addKey,
    updateKey,
    deleteKey,
    validateKey,
  }
}
