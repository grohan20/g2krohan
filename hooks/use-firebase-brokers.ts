"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, push, set, remove } from "firebase/database"

export interface Broker {
  id: string
  name: string
  description: string
  image: string
  attributes: string[]
  signupLink: string
}

export function useFirebaseBrokers() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const brokersRef = ref(database, "brokers")

    const unsubscribe = onValue(brokersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const brokersArray = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }))
        setBrokers(brokersArray)
      } else {
        setBrokers([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addBroker = async (broker: Omit<Broker, "id">) => {
    const brokersRef = ref(database, "brokers")
    await push(brokersRef, broker)
  }

  const updateBroker = async (id: string, broker: Omit<Broker, "id">) => {
    const brokerRef = ref(database, `brokers/${id}`)
    await set(brokerRef, broker)
  }

  const deleteBroker = async (id: string) => {
    const brokerRef = ref(database, `brokers/${id}`)
    await remove(brokerRef)
  }

  return {
    brokers,
    loading,
    addBroker,
    updateBroker,
    deleteBroker,
  }
}
