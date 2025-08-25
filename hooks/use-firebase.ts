"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, push, remove, onValue, off, update } from "firebase/database"

export interface Review {
  id: string
  title: string
  titleBn: string
  type: "image" | "video"
  mediaUrl: string
  timestamp: number
}

export interface Broker {
  id: string
  name: string
  nameBn: string
  image: string
  signupLink: string
  attributes: string[]
}

export interface ActivationKey {
  id: string
  key: string
  type: "one-time" | "unlimited"
  duration: number
  maxUses: number
  currentUses: number
  createdAt: number
  expiresAt: number
}

export function useFirebaseReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const reviewsRef = ref(database, "reviews")

    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const reviewsArray = Object.entries(data).map(([id, review]: [string, any]) => ({
          id,
          ...review,
        }))
        setReviews(reviewsArray.sort((a, b) => b.timestamp - a.timestamp))
      } else {
        setReviews([])
      }
      setLoading(false)
    })

    return () => off(reviewsRef, "value", unsubscribe)
  }, [])

  const addReview = async (review: Omit<Review, "id">) => {
    const reviewsRef = ref(database, "reviews")
    await push(reviewsRef, review)
  }

  const updateReview = async (id: string, review: Partial<Review>) => {
    const reviewRef = ref(database, `reviews/${id}`)
    await update(reviewRef, review)
  }

  const deleteReview = async (id: string) => {
    const reviewRef = ref(database, `reviews/${id}`)
    await remove(reviewRef)
  }

  return { reviews, loading, addReview, updateReview, deleteReview }
}

export function useFirebaseBrokers() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const brokersRef = ref(database, "brokers")

    const unsubscribe = onValue(brokersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const brokersArray = Object.entries(data).map(([id, broker]: [string, any]) => ({
          id,
          ...broker,
        }))
        setBrokers(brokersArray)
      } else {
        setBrokers([])
      }
      setLoading(false)
    })

    return () => off(brokersRef, "value", unsubscribe)
  }, [])

  const addBroker = async (broker: Omit<Broker, "id">) => {
    const brokersRef = ref(database, "brokers")
    await push(brokersRef, broker)
  }

  const updateBroker = async (id: string, broker: Partial<Broker>) => {
    const brokerRef = ref(database, `brokers/${id}`)
    await update(brokerRef, broker)
  }

  const deleteBroker = async (id: string) => {
    const brokerRef = ref(database, `brokers/${id}`)
    await remove(brokerRef)
  }

  return { brokers, loading, addBroker, updateBroker, deleteBroker }
}

export function useFirebaseActivationKeys() {
  const [keys, setKeys] = useState<ActivationKey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const keysRef = ref(database, "activation_keys")

    const unsubscribe = onValue(keysRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const keysArray = Object.entries(data).map(([id, key]: [string, any]) => ({
          id,
          ...key,
        }))
        setKeys(keysArray.sort((a, b) => b.createdAt - a.createdAt))
      } else {
        setKeys([])
      }
      setLoading(false)
    })

    return () => off(keysRef, "value", unsubscribe)
  }, [])

  const addKey = async (key: Omit<ActivationKey, "id">) => {
    const keysRef = ref(database, "activation_keys")
    await push(keysRef, key)
  }

  const validateKey = async (keyValue: string): Promise<ActivationKey | null> => {
    return new Promise((resolve) => {
      const keysRef = ref(database, "activation_keys")
      onValue(
        keysRef,
        (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const foundKey = Object.entries(data).find(
              ([id, key]: [string, any]) =>
                key.key === keyValue &&
                key.expiresAt > Date.now() &&
                (key.type === "unlimited" || key.currentUses < key.maxUses),
            )
            if (foundKey) {
              resolve({ id: foundKey[0], ...foundKey[1] } as ActivationKey)
            } else {
              resolve(null)
            }
          } else {
            resolve(null)
          }
        },
        { onlyOnce: true },
      )
    })
  }

  const useKey = async (keyId: string) => {
    const keyRef = ref(database, `activation_keys/${keyId}`)
    const usageRef = ref(database, "key_usage")

    // Increment usage count
    onValue(
      keyRef,
      async (snapshot) => {
        const keyData = snapshot.val()
        if (keyData && keyData.type === "one-time") {
          await update(keyRef, { currentUses: keyData.currentUses + 1 })
        }

        // Log usage
        await push(usageRef, {
          keyId,
          usedAt: Date.now(),
          ipAddress: "unknown", // You can implement IP detection if needed
        })
      },
      { onlyOnce: true },
    )
  }

  const deleteKey = async (id: string) => {
    const keyRef = ref(database, `activation_keys/${id}`)
    await remove(keyRef)
  }

  return { keys, loading, addKey, validateKey, useKey, deleteKey }
}
