"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Crown, TrendingUp, TrendingDown, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react'
import Image from "next/image"

interface SignalGeneratorProps {
  language: "en" | "bn"
}

interface Signal {
  pair: string
  time: number | string
  direction: "UP" | "DOWN"
  timestamp: string
  entryTime?: string
  software?: string // Add software field to signal interface
}

export function SignalGenerator({ language }: SignalGeneratorProps) {
  const [selectedPair, setSelectedPair] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedSoftware, setSelectedSoftware] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [signals, setSignals] = useState<Signal[]>([])
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastSignalTime, setLastSignalTime] = useState<{ [key: string]: Date }>({})

  const content = {
    en: {
      title: "LumenTrade AI",
      subtitle: "LumenTrade AI - Your 24/7 AI Trading Signal Partner",
      quotexSignals: "Quotex Signals",
      selectPair: "Select Currency Pair",
      selectType: "Select Type",
      selectSoftware: "Select Software",
      liveSignal: "Live Signal",
      futureSignal: "Future Signal",
      getSignal: "Get Signal",
      realMarketOff: "Real Market Off",
      alreadyRunning: "Already Signal Running",
      analysing: "Analysing",
      running: "Running",
      software: "Software",
      apiRun: "LumenTrade AI API Run",
      completeAnalysing: "Complete Analysing",
      nextCandle: "Next Candle",
      entryTime: "Entry Time",
      useLowAmount: "Use Low Amount",
      riskManagement: "Risk management is Success key!",
      up: "UP",
      down: "DOWN",
      marketOffMessage: "Real Market Is Off",
      downloadSignals: "Download Signals",
    },
    bn: {
      title: "LumenTrade AI",
      subtitle: "LumenTrade AI - আপনার ২৪/৭ AI ট্রেডিং সিগন্যাল পার্টনার",
      quotexSignals: "Quotex সিগন্যাল",
      selectPair: "কারেন্সি পেয়ার নির্বাচন করুন",
      selectType: "ধরন নির্বাচন করুন",
      selectSoftware: "সফটওয়্যার নির্বাচন করুন",
      liveSignal: "লাইভ সিগন্যাল",
      futureSignal: "ভবিষ্যত সিগন্যাল",
      getSignal: "সিগন্যাল পান",
      realMarketOff: "রিয়েল মার্কেট বন্ধ",
      alreadyRunning: "ইতিমধ্যে সিগন্যাল চলছে",
      analysing: "বিশ্লেষণ করা হচ্ছে",
      running: "চালু করা হচ্ছে",
      software: "সফটওয়্যার",
      apiRun: "LumenTrade AI API চালু",
      completeAnalysing: "বিশ্লেষণ সম্পূর্ণ",
      nextCandle: "পরবর্তী ক্যান্ডেল",
      entryTime: "এন্ট্রি টাইম",
      useLowAmount: "কম পরিমাণ ব্যবহার করুন",
      riskManagement: "ঝুঁকি ব্যবস্থাপনা সাফল্যের চাবিকাঠি!",
      up: "উপরে",
      down: "নিচে",
      marketOffMessage: "রিয়েল মার্কেট বন্ধ আছে",
      downloadSignals: "সিগন্যাল ডাউনলোড",
    },
  }

  const currencyPairs = [
    "AUD/USD (OTC)",
    "CAD/JPY (OTC)",
    "CHF/JPY (OTC)",
    "EUR/JPY (OTC)",
    "EUR/USD (OTC)",
    "USD/BDT (OTC)",
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
    "AUD/USD",
    "NZD/USD",
    "USD/CAD",
    "EUR/GBP",
    "EUR/AUD",
    "GBP/JPY",
    "EUR/JPY",
    "GBP/CHF",
    "EUR/CHF",
    "USD/TRY",
    "USD/MXN",
    "USD/ZAR",
    "EUR/TRY",
    "GBP/SGD",
    "AUD/SGD",
    "NZD/SGD",
  ]

  const softwareOptions = [
    "LumenTrade Ai",
    "Anacondax",
    "LumenPantherx",
    "LumenVenomx",
    "LumenFalconx",
    "LumenCobrax",
    "LumenWolfx",
    "LumenEaglex",
    "Lumen",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const isWeekend = () => {
    const day = currentTime.getDay()
    return day === 0 || day === 6 // Sunday = 0, Saturday = 6
  }

  const isRealMarketClosed = () => {
    return isWeekend() && selectedPair && !selectedPair.includes("(OTC)")
  }

  const canGenerateSignal = () => {
    if (!selectedPair || !selectedType || !selectedSoftware) return false

    const key = `${selectedPair}-${selectedType}`
    const lastTime = lastSignalTime[key]

    if (!lastTime) return true

    const timeDiff = currentTime.getTime() - lastTime.getTime()
    const minWaitTime = selectedType === "Live Signal" ? 3 * 60 * 1000 : 5 * 60 * 1000

    return timeDiff >= minWaitTime
  }

  const downloadSignals = () => {
    if (signals.length === 0 || selectedType !== "Future Signal") return

    const signalText = signals
      .map((signal, index) => {
        return `Signal ${index + 1}:
Currency Pair: ${signal.pair}
Entry Time: ${signal.entryTime}
Direction: ${signal.direction}
Software: ${signal.software}
Generated: ${signal.timestamp}
---`
      })
      .join("\n")

    const blob = new Blob([signalText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `LumenTrade_Future_Signals_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateSignal = async () => {
    if (!canGenerateSignal()) {
      alert(content[language].alreadyRunning)
      return
    }

    if (isRealMarketClosed()) {
      alert(content[language].marketOffMessage)
      return
    }

    setIsGenerating(true)
    setAnalysisSteps([])
    setSignals([])

    const steps = [
      `${content[language].analysing} ${selectedPair}`,
      `${content[language].analysing} ${selectedType}`,
      `${content[language].running} ${selectedSoftware} ${content[language].software}`,
      content[language].completeAnalysing,
    ]

    // Show steps one by one
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2500))
      setAnalysisSteps((prev) => [...prev, steps[i]])
    }

    // Generate signals
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (selectedType === "Live Signal") {
      const signal: Signal = {
        pair: selectedPair,
        time: Math.floor(Math.random() * 5) + 1,
        direction: Math.random() > 0.5 ? "UP" : "DOWN",
        timestamp: currentTime.toLocaleTimeString(),
        software: selectedSoftware,
      }
      setSignals([signal])
    } else {
      const futureSignals: Signal[] = []
      const startTime = new Date(currentTime.getTime() + 10 * 60 * 1000)
      const endTime = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000)

      for (let i = 0; i < 7; i++) {
        const randomTime = new Date(startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime()))
        const militaryTime = randomTime.toTimeString().slice(0, 5)

        futureSignals.push({
          pair: selectedPair,
          time: militaryTime,
          direction: Math.random() > 0.5 ? "UP" : "DOWN",
          timestamp: currentTime.toLocaleTimeString(),
          entryTime: militaryTime,
          software: selectedSoftware,
        })
      }

      futureSignals.sort((a, b) => a.entryTime!.localeCompare(b.entryTime!))
      setSignals(futureSignals)
    }

    const key = `${selectedPair}-${selectedType}`
    setLastSignalTime((prev) => ({ ...prev, [key]: new Date() }))

    setIsGenerating(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-2xl md:text-4xl font-bold gradient-text">{content[language].title}</h2>
          <Crown size={28} className="text-[#ff4d6d]" />
        </div>
        <p className="text-[#a6b1d8]">{content[language].subtitle}</p>
      </div>

      {/* Main Signal Generator */}
      <div className="trading-card rounded-xl p-6 mb-8">
        {/* Quotex Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden">
            <Image
              src="https://i.ibb.co/7JkPHQ0V/image.jpg"
              alt="Quotex"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold text-white">{content[language].quotexSignals}</h3>
        </div>

        {/* Selection Controls */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#a6b1d8] mb-2">{content[language].selectPair}</label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white">
                <SelectValue placeholder={content[language].selectPair} />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2340] border-[#00e0a4]/30">
                {currencyPairs.map((pair) => (
                  <SelectItem key={pair} value={pair} className="text-white hover:bg-[#00e0a4]/20">
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a6b1d8] mb-2">{content[language].selectType}</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white">
                <SelectValue placeholder={content[language].selectType} />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2340] border-[#00e0a4]/30">
                <SelectItem value="Live Signal" className="text-white hover:bg-[#00e0a4]/20">
                  {content[language].liveSignal}
                </SelectItem>
                <SelectItem value="Future Signal" className="text-white hover:bg-[#00e0a4]/20">
                  {content[language].futureSignal}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a6b1d8] mb-2">{content[language].selectSoftware}</label>
            <Select value={selectedSoftware} onValueChange={setSelectedSoftware}>
              <SelectTrigger className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white">
                <SelectValue placeholder={content[language].selectSoftware} />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2340] border-[#00e0a4]/30">
                {softwareOptions.map((software) => (
                  <SelectItem key={software} value={software} className="text-white hover:bg-[#00e0a4]/20">
                    {software}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateSignal}
          disabled={!selectedPair || !selectedType || !selectedSoftware || isGenerating || isRealMarketClosed()}
          className="w-full bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80 text-white font-semibold disabled:opacity-50"
        >
          {isRealMarketClosed() ? content[language].realMarketOff : content[language].getSignal}
        </Button>
      </div>

      {/* Analysis Terminal */}
      {isGenerating && (
        <div className="trading-card rounded-xl p-6 mb-6">
          <div className="space-y-3">
            {analysisSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 text-[#a6b1d8]">
                <CheckCircle size={16} className="text-[#00e0a4]" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signals Display */}
      {signals.length > 0 && (
        <div className="space-y-4">
          {selectedType === "Future Signal" && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={downloadSignals}
                className="bg-[#00e0a4] hover:bg-[#00e0a4]/80 text-white flex items-center gap-2"
              >
                <Download size={16} />
                {content[language].downloadSignals}
              </Button>
            </div>
          )}

          {signals.map((signal, index) => (
            <div key={index} className="trading-card rounded-xl p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-lg font-semibold text-white mb-2">{signal.pair}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-[#a6b1d8]" />
                    <span className="text-[#a6b1d8]">
                      {selectedType === "Future Signal"
                        ? `${signal.time} (${content[language].entryTime})`
                        : `${signal.time} min (${content[language].nextCandle})`}
                    </span>
                  </div>
                  <div className="text-sm text-[#00e0a4] mb-2 font-medium">{signal.software}</div>
                  <div className="flex items-center gap-2 mb-4">
                    {signal.direction === "UP" ? (
                      <TrendingUp size={20} className="text-[#00e0a4]" />
                    ) : (
                      <TrendingDown size={20} className="text-[#ff4d6d]" />
                    )}
                    <span
                      className={`font-semibold ${signal.direction === "UP" ? "text-[#00e0a4]" : "text-[#ff4d6d]"}`}
                    >
                      {signal.direction === "UP" ? content[language].up : content[language].down}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#a6b1d8]">
                    <AlertTriangle size={16} className="text-[#ff4d6d]" />
                    <span className="text-sm">{content[language].useLowAmount}</span>
                  </div>
                  <div className="text-sm text-[#a6b1d8] italic">{content[language].riskManagement}</div>
                  <div className="text-xs text-[#a6b1d8]">Generated: {signal.timestamp}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
