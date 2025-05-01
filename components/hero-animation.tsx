"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Load phone image
    const phoneImage = new Image()
    phoneImage.crossOrigin = "anonymous"
    phoneImage.src = "/placeholder.svg?height=600&width=300"

    // Load transparent keyboard image
    const keyboardImage = new Image()
    keyboardImage.crossOrigin = "anonymous"
    keyboardImage.src = "/placeholder.svg?height=200&width=300"

    // Animation variables
    let opacity = 0
    let direction = 0.01
    let frame = 0

    // Animation function
    const animate = () => {
      frame++

      // Clear canvas
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // Draw phone
      if (phoneImage.complete) {
        ctx.drawImage(phoneImage, (canvas.clientWidth - 300) / 2, 0, 300, 600)
      }

      // Draw transparent keyboard with pulsing opacity
      if (keyboardImage.complete) {
        if (frame % 2 === 0) {
          opacity += direction
          if (opacity >= 0.7 || opacity <= 0.2) {
            direction *= -1
          }
        }

        ctx.globalAlpha = opacity
        ctx.drawImage(keyboardImage, (canvas.clientWidth - 300) / 2, 400, 300, 200)
        ctx.globalAlpha = 1

        // Draw text being typed
        ctx.font = "16px Arial"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"

        const text = "ViewSpace로 더 넓은 화면에서 타이핑하세요..."
        const visibleText = text.substring(0, Math.floor(frame / 5) % (text.length + 1))

        ctx.fillText(visibleText, canvas.clientWidth / 2, 300)
      }

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Track when animation is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trackEvent("hero_animation_visible")
        }
      })
    })

    observer.observe(canvas)

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-2xl" />
}
