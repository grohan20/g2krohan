"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Play, Eye } from "lucide-react"
import Image from "next/image"

interface Review {
  id: string
  title: string
  titleBn: string
  mediaUrl: string
  type: "image" | "video"
  reviewLink: string
}

interface ReviewCardProps {
  review: Review
  language: "en" | "bn"
}

export function ReviewCard({ review, language }: ReviewCardProps) {
  const content = {
    en: {
      seeReview: "See Review",
      watchReview: "Watch Review",
    },
    bn: {
      seeReview: "রিভিউ দেখুন",
      watchReview: "রিভিউ দেখুন",
    },
  }

  const title = language === "en" ? review.title : review.titleBn
  const buttonText = review.type === "video" ? content[language].watchReview : content[language].seeReview
  const Icon = review.type === "video" ? Play : Eye

  return (
    <div className="trading-card rounded-xl p-6 hover:premium-glow transition-all duration-300">
      <div className="space-y-4">
        {/* Review Title */}
        <h3 className="text-lg font-bold text-white text-center">{title}</h3>

        {/* Review Image/Video Thumbnail */}
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={review.mediaUrl || "/placeholder.svg?height=200&width=300&text=Review+Image"}
            alt={title}
            fill
            className="object-cover"
          />
          {review.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play size={24} className="text-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="w-full bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80 text-white font-semibold shine-effect"
        >
          <a
            href={review.reviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <Icon size={16} />
            {buttonText}
            <ExternalLink size={16} />
          </a>
        </Button>
      </div>
    </div>
  )
}
