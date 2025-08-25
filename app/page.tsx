"use client"

import { useState } from "react"
import { TradingBackground } from "@/components/trading-background"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NavigationMenu } from "@/components/navigation-menu"
import { BrokerCard } from "@/components/broker-card"
import { Button } from "@/components/ui/button"
import { Send, DollarSign, TrendingUp, Users, Bot, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useFirebaseBrokers } from "@/hooks/use-firebase-brokers"

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const { brokers, loading } = useFirebaseBrokers()

  return (
    <div className="min-h-screen relative">
      <TradingBackground />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LT</span>
          </div>
          <h1 className="text-xl font-bold gradient-text">LumenTrade</h1>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher onLanguageChange={setLanguage} currentLang={language} />
          <NavigationMenu language={language} />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-6 pb-8">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            {language === "en" ? "Welcome To Lumen Trade" : "লুমেন ট্রেডে স্বাগতম"}
          </h2>
          <p className="text-lg md:text-xl text-[#a6b1d8] mb-8 leading-relaxed">
            {language === "en"
              ? "Join the Lumen Trade community to learn trading and earn 50,000 – 100,000 monthly through trading."
              : "ট্রেডিং শিখতে এবং ট্রেডিংয়ের মাধ্যমে মাসিক ৫০,০০০ – ১,০০,০০০ টাকা আয় করতে লুমেন ট্রেড কমিউনিটিতে যোগ দিন।"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80 text-white font-semibold shine-effect px-8"
            >
              <a
                href="https://t.me/+1W6FTialTNRiNjI9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Send size={20} />
                {language === "en" ? "Join Telegram" : "টেলিগ্রাম যোগ দিন"}
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#ff4d6d] to-[#ff6b35] hover:from-[#ff4d6d]/80 hover:to-[#ff6b35]/80 text-white font-semibold shine-effect px-8"
            >
              <Link href="/ai" className="flex items-center gap-2">
                <Bot size={20} />
                {language === "en" ? "Use LumenTrade AI" : "LumenTrade AI ব্যবহার করুন"}
              </Link>
            </Button>
          </div>
        </section>

        {/* Broker Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {language === "en" ? "Open Your Trading Account Today" : "আজই আপনার ট্রেডিং অ্যাকাউন্ট খুলুন"}
            </h3>
            <p className="text-[#a6b1d8]">
              {language === "en"
                ? "Choose the perfect trading platform based on your investment level and trading style"
                : "আপনার বিনিয়োগের স্তর এবং ট্রেডিং স্টাইলের উপর ভিত্তি করে নিখুঁত ট্রেডিং প্ল্যাটফর্ম বেছে নিন"}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-[#a6b1d8]">Loading brokers...</div>
            </div>
          ) : brokers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {brokers.map((broker) => (
                <BrokerCard key={broker.id} {...broker} language={language} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-[#a6b1d8]">No Broker Setted</div>
            </div>
          )}
        </section>

        {/* Trading Benefits */}
        <section className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {language === "en" ? "Trading Benefits" : "ট্রেডিং সুবিধা"}
            </h3>
            <p className="text-[#a6b1d8] mb-8">
              {language === "en"
                ? "Discover the advantages of binary trading with LumenTrade community"
                : "LumenTrade কমিউনিটির সাথে বাইনারি ট্রেডিংয়ের সুবিধাগুলি আবিষ্কার করুন"}
            </p>
            <h4 className="text-xl font-semibold gradient-text">
              {language === "en" ? "Binary Trading Benefits" : "বাইনারি ট্রেডিং সুবিধা"}
            </h4>
          </div>

          {/* Floating Benefits */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {[
              {
                icon: TrendingUp,
                title: language === "en" ? "Quick Results" : "দ্রুত ফলাফল",
                desc:
                  language === "en"
                    ? "Fast-paced trading with quick profit opportunities"
                    : "দ্রুত লাভের সুযোগ সহ দ্রুতগতির ট্রেডিং",
              },
              {
                icon: DollarSign,
                title: language === "en" ? "Low Entry" : "কম বিনিয়োগ",
                desc:
                  language === "en"
                    ? "Start trading with as little as $10 investment"
                    : "মাত্র $১০ বিনিয়োগ দিয়ে ট্রেডিং শুরু করুন",
              },
              {
                icon: Users,
                title: language === "en" ? "Community Support" : "কমিউনিটি সাপোর্ট",
                desc:
                  language === "en"
                    ? "Learn from a community of successful binary traders"
                    : "সফল বাইনারি ট্রেডারদের কমিউনিটি থেকে শিখুন",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="trading-card rounded-xl p-6 float-animation"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <benefit.icon size={48} className="text-[#00e0a4] mb-4 mx-auto" />
                <h5 className="text-lg font-semibold text-white mb-2 text-center">{benefit.title}</h5>
                <p className="text-[#a6b1d8] text-sm text-center">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {[
              { icon: DollarSign, value: "50K-100K", label: language === "en" ? "Monthly" : "মাসিক" },
              {
                icon: TrendingUp,
                value: language === "en" ? "Expert" : "এক্সপার্ট",
                label: language === "en" ? "Trading Signals" : "ট্রেডিং সিগন্যাল",
              },
              { icon: Users, value: "10000+", label: language === "en" ? "Active Traders" : "সক্রিয় ট্রেডার" },
              {
                icon: Bot,
                value: "LumenTrade AI",
                label: language === "en" ? "Super Power Signals" : "সুপার পাওয়ার সিগন্যাল",
              },
            ].map((stat, index) => (
              <div key={index} className="trading-card rounded-xl p-4 text-center shine-effect">
                <stat.icon size={32} className="text-[#00e0a4] mb-2 mx-auto" />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[#a6b1d8]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Join */}
        <section className="max-w-2xl mx-auto mb-16">
          <div className="trading-card rounded-xl p-8 text-center">
            <Send size={48} className="text-[#00e0a4] mb-4 mx-auto float-animation" />
            <h3 className="text-xl font-bold text-white mb-6">
              {language === "en" ? "Join LumenTrade Trading Community" : "LumenTrade ট্রেডিং কমিউনিটিতে যোগ দিন"}
            </h3>

            <div className="space-y-3 mb-6">
              {[
                {
                  icon: CheckCircle,
                  text: language === "en" ? "Get free signals & updates" : "বিনামূল্যে সিগন্যাল এবং আপডেট পান",
                },
                { icon: Users, text: language === "en" ? "Learn with community support" : "কমিউনিটি সাপোর্ট দিয়ে শিখুন" },
                {
                  icon: TrendingUp,
                  text: language === "en" ? "Stay connected with real traders" : "প্রকৃত ট্রেডারদের সাথে সংযুক্ত থাকুন",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-[#a6b1d8]">
                  <item.icon size={16} className="text-[#00e0a4]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80 text-white font-semibold shine-effect w-full"
            >
              <a href="https://t.me/+1W6FTialTNRiNjI9" target="_blank" rel="noopener noreferrer">
                {language === "en" ? "Join Now" : "এখনই যোগ দিন"}
              </a>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-[#a6b1d8] space-y-2 max-w-4xl mx-auto">
          <p>
            {language === "en"
              ? "⚠️ Risk Warning: Trading involves high risk and may not be suitable for all investors. You could lose all of your invested capital."
              : "⚠️ ঝুঁকি সতর্কতা: ট্রেডিং উচ্চ ঝুঁকি জড়িত এবং সব বিনিয়োগকারীদের জন্য উপযুক্ত নাও হতে পারে। আপনি আপনার সমস্ত বিনিয়োগকৃত পুঁজি হারাতে পারেন।"}
          </p>
          <p>
            {language === "en"
              ? "🚫 18+ Only | For Educational Purposes Only."
              : "🚫 ১৮+ শুধুমাত্র | শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে।"}
          </p>
          <p className="font-semibold">
            {language === "en" ? "© 2025 LumenTrade - All Rights Reserved" : "© ২০২৫ LumenTrade - সমস্ত অধিকার সংরক্ষিত"}
          </p>
        </footer>
      </main>
    </div>
  )
}
