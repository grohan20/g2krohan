"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, MessageSquare, Bot, Send } from "lucide-react"
import Link from "next/link"

interface NavigationMenuProps {
  language: "en" | "bn"
}

export function NavigationMenu({ language }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = {
    en: [
      { icon: Home, label: "Home", href: "/" },
      { icon: MessageSquare, label: "Review", href: "/review" },
      { icon: Bot, label: "LumenTrade AI", href: "/ai", special: true },
      { icon: Send, label: "Join Telegram", href: "https://t.me/+1W6FTialTNRiNjI9", external: true, telegram: true },
    ],
    bn: [
      { icon: Home, label: "হোম", href: "/" },
      { icon: MessageSquare, label: "রিভিউ", href: "/review" },
      { icon: Bot, label: "LumenTrade AI", href: "/ai", special: true },
      { icon: Send, label: "টেলিগ্রাম যোগ দিন", href: "https://t.me/+1W6FTialTNRiNjI9", external: true, telegram: true },
    ],
  }

  return (
    <div className="relative z-[10000]">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white hover:bg-white/10 p-2">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a2340]/95 backdrop-blur-lg rounded-lg border border-white/10 shadow-xl z-[99999]">
          <div className="p-2 space-y-1">
            {menuItems[language].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  item.special
                    ? "bg-gradient-to-r from-[#00e0a4]/20 to-[#4f46e5]/20 text-[#00e0a4] hover:from-[#00e0a4]/30 hover:to-[#4f46e5]/30"
                    : item.telegram
                      ? "bg-[#ff4d6d]/20 text-[#ff4d6d] hover:bg-[#ff4d6d]/30"
                      : "text-white hover:bg-white/10"
                }`}
              >
                <item.icon size={16} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
