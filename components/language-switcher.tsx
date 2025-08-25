"use client"
import { Button } from "@/components/ui/button"

interface LanguageSwitcherProps {
  onLanguageChange: (lang: "en" | "bn") => void
  currentLang: "en" | "bn"
}

export function LanguageSwitcher({ onLanguageChange, currentLang }: LanguageSwitcherProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(currentLang === "en" ? "bn" : "en")}
      className="text-white hover:bg-white/10 font-medium"
    >
      {currentLang === "en" ? "EN" : "BN"}
    </Button>
  )
}
