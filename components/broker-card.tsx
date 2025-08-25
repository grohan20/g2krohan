"use client"

import { Star, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface BrokerCardProps {
  name: string
  description: string
  image: string
  attributes: string[]
  signupLink: string
  language: "en" | "bn"
}

export function BrokerCard({ name, description, image, attributes, signupLink, language }: BrokerCardProps) {
  const signupText = language === "en" ? "SignUp Now" : "এখনই সাইন আপ করুন"

  return (
    <div className="trading-card rounded-xl p-6 hover:premium-glow transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00e0a4]/30">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <p className="text-[#a6b1d8] text-sm leading-relaxed">{description}</p>
        </div>

        <div className="space-y-2 w-full">
          {attributes.map((attr, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-[#a6b1d8]">
              <Star size={12} className="text-[#00e0a4] fill-current" />
              <span>{attr}</span>
            </div>
          ))}
        </div>

        <Button
          asChild
          className="w-full bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80 text-white font-semibold shine-effect"
        >
          <a
            href={signupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            {signupText}
            <ExternalLink size={16} />
          </a>
        </Button>
      </div>
    </div>
  )
}
