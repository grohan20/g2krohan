"use client"

import { useState, useEffect } from "react"
import { TradingBackground } from "@/components/trading-background"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NavigationMenu } from "@/components/navigation-menu"
import { ActivationModal } from "@/components/activation-modal"
import { SignalGenerator } from "@/components/signal-generator"
import { Button } from "@/components/ui/button"
import { Crown, Star, TrendingUp, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useFirebaseActivatedUsers } from "@/hooks/use-firebase-activated-users"

const getInitialActivationState = () => {
  if (typeof window === "undefined") return { isActivated: false, userStatus: null }

  const savedUser = localStorage.getItem("lumentradeUser")
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser)
      return {
        isActivated: true,
        userStatus: { name: userData.name, key: userData.key, isBanned: false },
      }
    } catch (error) {
      localStorage.removeItem("lumentradeUser")
      return { isActivated: false, userStatus: null }
    }
  }
  return { isActivated: false, userStatus: null }
}

export default function AIPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")

  const initialState = getInitialActivationState()
  const [isActivated, setIsActivated] = useState(initialState.isActivated)
  const [userStatus, setUserStatus] = useState<{ name: string; key: string; isBanned: boolean } | null>(
    initialState.userStatus,
  )

  const [showActivationModal, setShowActivationModal] = useState(false)
  const [hasCheckedInitialStatus, setHasCheckedInitialStatus] = useState(false)
  const { checkUserStatus, loading } = useFirebaseActivatedUsers()

  useEffect(() => {
    if (loading || hasCheckedInitialStatus) return

    const checkActivationStatus = async () => {
      const savedUser = localStorage.getItem("lumentradeUser")
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          const status = await checkUserStatus(userData.name, userData.key)

          if (status) {
            setUserStatus({ name: userData.name, key: userData.key, isBanned: status.isBanned })
            setIsActivated(true)
          } else {
            localStorage.removeItem("lumentradeUser")
            setIsActivated(false)
            setUserStatus(null)
          }
        } catch (error) {
          console.error("Error checking user status:", error)
          localStorage.removeItem("lumentradeUser")
          setIsActivated(false)
          setUserStatus(null)
        }
      }
      setHasCheckedInitialStatus(true)
    }

    checkActivationStatus()
  }, [loading, hasCheckedInitialStatus, checkUserStatus])

  useEffect(() => {
    if (!userStatus || !isActivated || loading || !hasCheckedInitialStatus) return

    const currentStatus = checkUserStatus(userStatus.name, userStatus.key)
    if (currentStatus && currentStatus.isBanned !== userStatus.isBanned) {
      setUserStatus((prev) => (prev ? { ...prev, isBanned: currentStatus.isBanned } : null))
    }
  }, [userStatus, isActivated, loading, hasCheckedInitialStatus, checkUserStatus])

  const content = {
    en: {
      title: "The Flash LumenTrade AI",
      subtitle: "LumenTradeAi - Your 24/7 AI Trading Signal Partner",
      makeActive: "Make Active",
      useNow: "Use Now",
      youAreBanned: "You Are Banned",
      runAI: "Run AI",
      quotexSignals: "Quotex Signals",
      unlockPremium: "Unlock Premium Accuracy LumenTrade AI with G2kRohan VIP Signals!",
      vipDescription:
        "Tired of losing trades? Get access to 100% premium AI-powered signals designed to maximize your profits. Our VIP members enjoy higher win rates, exclusive strategies, and real-time support.",
      stepsTitle: "Steps to Join VIP:",
      step1: "1️⃣ Open your trading account with our official partners: Quotex",
      step2: "2️⃣ Deposit a minimum of $30 into your account.",
      step3: "3️⃣ Send your Trader ID to our official Telegram: @iamhear1",
      step4: "4️⃣ After quick verification, you'll get full VIP access instantly.",
      whyJoinTitle: "Why Join VIP?",
      whyJoin1: "More accurate signals (Higher Win Rate)",
      whyJoin2: "Early access to powerful strategies",
      whyJoin3: "24/7 priority support",
      whyJoin4: "Private VIP community of serious traders",
      joinVipNow: "Join VIP Now – Start Winning Today",
      ageWarning: "🚫 18+ Only | For Educational Purposes Only.",
      copyright: "© 2025 LumenTrade - All Rights Reserved",
    },
    bn: {
      title: "দ্য ফ্ল্যাশ LumenTrade AI",
      subtitle: "LumenTradeAi - আপনার ২৪/৭ AI ট্রেডিং সিগন্যাল পার্টনার",
      makeActive: "সক্রিয় করুন",
      useNow: "এখন ব্যবহার করুন",
      youAreBanned: "আপনি নিষিদ্ধ",
      runAI: "AI চালান",
      quotexSignals: "Quotex সিগন্যাল",
      unlockPremium: "G2kRohan VIP সিগন্যাল দিয়ে প্রিমিয়াম নির্ভুলতা LumenTrade AI আনলক করুন!",
      vipDescription:
        "ট্রেড হারিয়ে ক্লান্ত? আপনার লাভ সর্বোচ্চ করার জন্য ডিজাইন করা ১০০% প্রিমিয়াম AI-চালিত সিগন্যালে অ্যাক্সেস পান। আমাদের VIP সদস্যরা উচ্চ জয়ের হার, একচেটিয়া কৌশল এবং রিয়েল-টাইম সাপোর্ট উপভোগ করেন।",
      stepsTitle: "VIP যোগদানের ধাপ:",
      step1: "1️⃣ আমাদের অফিসিয়াল পার্টনারদের সাথে আপনার ট্রেডিং অ্যাকাউন্ট খুলুন: Quotex",
      step2: "2️⃣ আপনার অ্যাকাউন্টে সর্বনিম্ন $৩০ জমা করুন।",
      step3: "3️⃣ আমাদের অফিসিয়াল টেলিগ্রামে আপনার ট্রেডার ID পাঠান: @iamhear1",
      step4: "4️⃣ দ্রুত যাচাইয়ের পর, আপনি তাৎক্ষণিক সম্পূর্ণ VIP অ্যাক্সেস পাবেন।",
      whyJoinTitle: "কেন VIP যোগ দিবেন?",
      whyJoin1: "আরও নির্ভুল সিগন্যাল (উচ্চ জয়ের হার)",
      whyJoin2: "শক্তিশালী কৌশলে প্রাথমিক অ্যাক্সেস",
      whyJoin3: "২৪/৭ অগ্রাধিকার সাপোর্ট",
      whyJoin4: "গুরুতর ট্রেডারদের ব্যক্তিগত VIP কমিউনিটি",
      joinVipNow: "এখনই VIP যোগ দিন – আজই জিতা শুরু করুন",
      ageWarning: "🚫 ১৮+ শুধুমাত্র | শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে।",
      copyright: "© ২০২৫ LumenTrade - সমস্ত অধিকার সংরক্ষিত",
    },
  }

  const handleBannedClick = () => {
    alert("Your Are Banner From Admin")
  }

  const handleActivationSuccess = (userData: { name: string; key: string }) => {
    localStorage.setItem("lumentradeUser", JSON.stringify(userData))
    setUserStatus({ ...userData, isBanned: false })
    setIsActivated(true)
    setShowActivationModal(false)
  }

  const getButtonConfig = () => {
    if (!isActivated) {
      return {
        text: content[language].makeActive,
        action: () => setShowActivationModal(true),
        className: "bg-gradient-to-r from-[#ff4d6d] to-[#ff6b35] hover:from-[#ff4d6d]/80 hover:to-[#ff6b35]/80",
      }
    }

    if (userStatus?.isBanned) {
      return {
        text: content[language].youAreBanned,
        action: handleBannedClick,
        className: "bg-red-500 hover:bg-red-600 rounded-xl",
      }
    }

    return {
      text: content[language].useNow,
      action: () => {}, // Signal generator is already shown when activated and not banned
      className: "bg-green-500 hover:bg-green-600 rounded-xl",
    }
  }

  const buttonConfig = getButtonConfig()

  return (
    <div className="min-h-screen relative">
      <TradingBackground />

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LT</span>
          </div>
          <h1 className="text-xl font-bold gradient-text">LumenTrade</h1>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher onLanguageChange={setLanguage} currentLang={language} />
          <NavigationMenu language={language} />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-6 pb-8">
        {!isActivated || userStatus?.isBanned ? (
          <>
            {/* AI Title Section */}
            <section className="text-center max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h2 className="text-3xl md:text-5xl font-bold gradient-text">{content[language].title}</h2>
                <Crown size={32} className="text-[#ff4d6d]" />
              </div>
              <p className="text-lg text-[#a6b1d8] mb-8">{content[language].subtitle}</p>

              {/* Quotex Image */}
              <div className="trading-card rounded-xl p-6 mb-6 shine-effect premium-glow">
                <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden">
                  <Image
                    src="https://i.ibb.co/7JkPHQ0V/image.jpg"
                    alt="Quotex"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white">{content[language].quotexSignals}</h3>
              </div>

              <Button
                size="lg"
                onClick={buttonConfig.action}
                className={`${buttonConfig.className} text-white font-semibold shine-effect px-12 mb-12`}
              >
                {buttonConfig.text}
              </Button>
            </section>

            {/* VIP Promotion Section - only show if not activated */}
            {!isActivated && (
              <section className="max-w-4xl mx-auto mb-16">
                <div className="trading-card rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Star size={32} className="text-[#ff4d6d]" />
                    <h3 className="text-xl md:text-2xl font-bold text-white">{content[language].unlockPremium}</h3>
                  </div>

                  <p className="text-[#a6b1d8] mb-8 leading-relaxed">{content[language].vipDescription}</p>

                  {/* Steps Section */}
                  <div className="trading-card rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">{content[language].stepsTitle}</h4>
                    <div className="space-y-3">
                      {[
                        content[language].step1,
                        content[language].step2,
                        content[language].step3,
                        content[language].step4,
                      ].map((step, index) => (
                        <p key={index} className="text-[#a6b1d8]">
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Why Join VIP */}
                  <div className="trading-card rounded-lg p-6 mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4">{content[language].whyJoinTitle}</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        { icon: TrendingUp, text: content[language].whyJoin1 },
                        { icon: Zap, text: content[language].whyJoin2 },
                        { icon: Shield, text: content[language].whyJoin3 },
                        { icon: Users, text: content[language].whyJoin4 },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <item.icon size={16} className="text-[#00e0a4]" />
                          <span className="text-[#a6b1d8]">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Join VIP Button */}
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80 text-white font-semibold shine-effect"
                  >
                    <a href="https://t.me/TraderRohan1" target="_blank" rel="noopener noreferrer">
                      {content[language].joinVipNow}
                    </a>
                  </Button>
                </div>
              </section>
            )}
          </>
        ) : (
          <SignalGenerator language={language} />
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-[#a6b1d8] space-y-2 max-w-4xl mx-auto">
          <p>{content[language].ageWarning}</p>
          <p className="font-semibold">{content[language].copyright}</p>
        </footer>
      </main>

      {/* Activation Modal */}
      <ActivationModal
        isOpen={showActivationModal}
        onClose={() => setShowActivationModal(false)}
        onActivate={handleActivationSuccess}
        language={language}
      />
    </div>
  )
}
