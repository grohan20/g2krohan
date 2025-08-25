"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Key } from "lucide-react"
import { useFirebaseActivationKeys } from "@/hooks/use-firebase-activation-keys"
import { useFirebaseActivatedUsers } from "@/hooks/use-firebase-activated-users"

interface ActivationModalProps {
  isOpen: boolean
  onClose: () => void
  onActivate: (userData: { name: string; key: string }) => void
  language: "en" | "bn"
}

export function ActivationModal({ isOpen, onClose, onActivate, language }: ActivationModalProps) {
  const [activationKey, setActivationKey] = useState("")
  const [userName, setUserName] = useState("")
  const { validateKey } = useFirebaseActivationKeys()
  const { addUser } = useFirebaseActivatedUsers()

  const content = {
    en: {
      title: "Enter Activation Key",
      placeholder: "Enter your activation key...",
      namePlaceholder: "Enter your name...",
      activateNow: "Activate Now",
      howToGet: "How To Get Activation Key",
      success: "Congratulations! LumenTrade AI has been activated successfully!",
      error: "Wrong Activation Key",
      nameRequired: "Please enter your name",
      vipMessage: "Join Our VIP & Get Activation Key For Active LumenTrade AI",
    },
    bn: {
      title: "অ্যাক্টিভেশন কী প্রবেশ করান",
      placeholder: "আপনার অ্যাক্টিভেশন কী প্রবেশ করান...",
      namePlaceholder: "আপনার নাম প্রবেশ করান...",
      activateNow: "এখনই সক্রিয় করুন",
      howToGet: "অ্যাক্টিভেশন কী কীভাবে পাবেন",
      success: "অভিনন্দন! LumenTrade AI সফলভাবে সক্রিয় করা হয়েছে!",
      error: "ভুল অ্যাক্টিভেশন কী",
      nameRequired: "অনুগ্রহ করে আপনার নাম প্রবেশ করান",
      vipMessage: "আমাদের VIP এ যোগ দিন এবং LumenTrade AI সক্রিয় করার জন্য অ্যাক্টিভেশন কী পান",
    },
  }

  const handleActivate = async () => {
    if (!userName.trim()) {
      alert(content[language].nameRequired)
      return
    }

    try {
      const isValid = await validateKey(activationKey)
      if (isValid) {
        const userData = {
          name: userName,
          activationKey: activationKey,
          activatedAt: new Date(),
          isBanned: false,
        }

        await addUser(userData)
        alert(content[language].success)

        onActivate({ name: userName, key: activationKey })

        // Clear form
        setActivationKey("")
        setUserName("")
      } else {
        alert(content[language].error)
      }
    } catch (error) {
      console.error("Activation error:", error)
      alert(content[language].error)
    }
  }

  const handleHowToGet = () => {
    alert(content[language].vipMessage)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="trading-card rounded-xl p-6 w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/10"
        >
          <X size={20} />
        </Button>

        <div className="text-center mb-6">
          <Key size={48} className="text-[#00e0a4] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{content[language].title}</h3>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder={content[language].placeholder}
            value={activationKey}
            onChange={(e) => setActivationKey(e.target.value)}
            className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white placeholder:text-[#a6b1d8]"
          />

          <Input
            type="text"
            placeholder={content[language].namePlaceholder}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white placeholder:text-[#a6b1d8]"
          />

          <Button
            onClick={handleActivate}
            className="w-full bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80 text-white font-semibold"
          >
            {content[language].activateNow}
          </Button>

          <Button
            variant="ghost"
            onClick={handleHowToGet}
            className="w-full text-[#a6b1d8] hover:bg-white/10 underline"
          >
            {content[language].howToGet}
          </Button>
        </div>
      </div>
    </div>
  )
}
