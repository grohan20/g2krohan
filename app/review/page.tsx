"use client"

import { useState } from "react"
import { TradingBackground } from "@/components/trading-background"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NavigationMenu } from "@/components/navigation-menu"
import { ReviewCard } from "@/components/review-card"
import Link from "next/link"
import { useFirebaseReviews } from "@/hooks/use-firebase"

export default function ReviewPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const { reviews, loading } = useFirebaseReviews()

  const content = {
    en: {
      title: "Customer Reviews",
      subtitle: "See what our community members are saying about LumenTrade",
      noReviews: "No Reviews Available",
      noReviewsDesc: "Check back later for customer reviews and testimonials.",
      backToHome: "Back to Home",
      riskWarning:
        "⚠️ Risk Warning: Trading involves high risk and may not be suitable for all investors. You could lose all of your invested capital.",
      ageWarning: "🚫 18+ Only | For Educational Purposes Only.",
      copyright: "© 2025 LumenTrade - All Rights Reserved",
    },
    bn: {
      title: "গ্রাহক রিভিউ",
      subtitle: "LumenTrade সম্পর্কে আমাদের কমিউনিটি সদস্যরা কী বলছেন দেখুন",
      noReviews: "কোন রিভিউ উপলব্ধ নেই",
      noReviewsDesc: "গ্রাহক রিভিউ এবং প্রশংসাপত্রের জন্য পরে আবার দেখুন।",
      backToHome: "হোমে ফিরুন",
      riskWarning:
        "⚠️ ঝুঁকি সতর্কতা: ট্রেডিং উচ্চ ঝুঁকি জড়িত এবং সব বিনিয়োগকারীদের জন্য উপযুক্ত নাও হতে পারে। আপনি আপনার সমস্ত বিনিয়োগকৃত পুঁজি হারাতে পারেন।",
      ageWarning: "🚫 ১৮+ শুধুমাত্র | শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে।",
      copyright: "© ২০২৫ LumenTrade - সমস্ত অধিকার সংরক্ষিত",
    },
  }

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
        {/* Page Title */}
        <section className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-4">{content[language].title}</h2>
          <p className="text-lg text-[#a6b1d8]">{content[language].subtitle}</p>
        </section>

        {/* Reviews Grid */}
        <section className="max-w-6xl mx-auto mb-16">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-[#a6b1d8]">Loading reviews...</div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} language={language} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="trading-card rounded-xl p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-white mb-2">{content[language].noReviews}</h3>
                <p className="text-[#a6b1d8] mb-6">{content[language].noReviewsDesc}</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  {content[language].backToHome}
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-[#a6b1d8] space-y-2 max-w-4xl mx-auto">
          <p>{content[language].riskWarning}</p>
          <p>{content[language].ageWarning}</p>
          <p className="font-semibold">{content[language].copyright}</p>
        </footer>
      </main>
    </div>
  )
}
