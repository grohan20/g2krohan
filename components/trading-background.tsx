"use client"

import { useEffect, useRef } from "react"

export function TradingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const candlesCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const DPR = Math.min(window.devicePixelRatio || 1, 1.75)

    function fitCanvas(canvas: HTMLCanvasElement) {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = Math.floor(w * DPR)
      canvas.height = Math.floor(h * DPR)
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      const ctx = canvas.getContext("2d")!
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      return ctx
    }

    const bgCanvas = canvasRef.current!
    const candlesCanvas = candlesCanvasRef.current!
    const ctx = fitCanvas(bgCanvas)
    const cctx = fitCanvas(candlesCanvas)

    let nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      r: number
      trail: Array<{ x: number; y: number }>
    }> = []
    let candles: Array<{
      x: number
      y: number
      w: number
      h: number
      bull: boolean
      speed: number
      wick: number
    }> = []

    function initNodes() {
      nodes = []
      const count = Math.floor((window.innerWidth * window.innerHeight) / 18000)
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 1.5 + 0.5,
          trail: [],
        })
      }
    }

    function stepNodes() {
      const W = window.innerWidth,
        H = window.innerHeight
      ctx.clearRect(0, 0, W, H)
      for (const p of nodes) {
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 6) p.trail.shift()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
        ctx.fillStyle = "rgba(166,177,216,0.85)"
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        /* Trail effect */
        ctx.strokeStyle = "rgba(0,224,164,0.15)"
        ctx.beginPath()
        for (let i = 0; i < p.trail.length - 1; i++) {
          ctx.moveTo(p.trail[i].x, p.trail[i].y)
          ctx.lineTo(p.trail[i + 1].x, p.trail[i + 1].y)
        }
        ctx.stroke()
      }

      const maxDist = 120
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j]
          const dx = a.x - b.x,
            dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < maxDist * maxDist) {
            const o = 1 - Math.sqrt(d2) / maxDist
            ctx.strokeStyle = `rgba(0,224,164,${0.02 + o * 0.1})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    function spawnCandle() {
      const W = window.innerWidth,
        H = window.innerHeight
      const bull = Math.random() > 0.5
      const x = Math.random() * W
      const h = Math.random() * 40 + 20
      const w = Math.random() * 5 + 3
      const y = H + Math.random() * 150
      const speed = Math.random() * 0.4 + 0.2
      candles.push({ x, y, w, h, bull, speed, wick: h + Math.random() * 20 })
    }

    function initCandles() {
      candles = []
      const count = Math.floor(window.innerWidth / 40)
      for (let i = 0; i < count; i++) spawnCandle()
    }

    function stepCandles() {
      const W = window.innerWidth,
        H = window.innerHeight
      cctx.clearRect(0, 0, W, H)
      for (const c of candles) {
        c.y -= c.speed
        if (c.y + c.h < -30) {
          c.y = H + Math.random() * 150
          c.x = Math.random() * W
        }

        /* Wick */
        cctx.strokeStyle = "rgba(166,177,216,0.4)"
        cctx.lineWidth = 1
        cctx.beginPath()
        const mid = c.x + c.w / 2
        cctx.moveTo(mid, c.y - c.wick * 0.5)
        cctx.lineTo(mid, c.y + c.h + c.wick * 0.5)
        cctx.stroke()

        /* Candle Body */
        cctx.fillStyle = c.bull ? "rgba(0,224,164,0.6)" : "rgba(255,77,109,0.6)"
        cctx.beginPath()
        cctx.rect(c.x, c.y, c.w, c.h)
        cctx.fill()
      }
    }

    function loop() {
      stepNodes()
      stepCandles()
      requestAnimationFrame(loop)
    }

    function init() {
      initNodes()
      initCandles()
      loop()
    }

    const handleResize = () => {
      fitCanvas(bgCanvas)
      fitCanvas(candlesCanvas)
      initNodes()
      initCandles()
    }

    window.addEventListener("resize", handleResize)
    init()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      {/* Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background: `
              radial-gradient(50vmax 50vmax at 25% 25%, rgba(0,224,164,0.15), transparent 60%),
              radial-gradient(40vmax 40vmax at 75% 30%, rgba(79,70,229,0.15), transparent 60%),
              radial-gradient(45vmax 45vmax at 45% 80%, rgba(255,77,109,0.12), transparent 60%)
            `,
            filter: "blur(100px)",
            animation: "drift 35s linear infinite alternate",
          }}
        />
      </div>

      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, transparent 0 1px, #1a2340 1px 2px, transparent 2px 100%),
            linear-gradient(to bottom, transparent 0 1px, #1a2340 1px 2px, transparent 2px 100%)
          `,
          backgroundSize: "50px 50px, 50px 50px",
        }}
      />

      {/* Noise */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.8"/></svg>') repeat`,
        }}
      />

      {/* Canvas Elements */}
      <canvas ref={canvasRef} className="fixed inset-0 block pointer-events-none" />
      <canvas ref={candlesCanvasRef} className="fixed inset-0 block pointer-events-none" />

      <style jsx>{`
        @keyframes drift {
          to {
            transform: translate3d(2rem, -2rem, 0) rotate(1deg);
          }
        }
      `}</style>
    </>
  )
}
