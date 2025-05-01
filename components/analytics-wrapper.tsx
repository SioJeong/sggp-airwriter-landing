"use client"

import { type ReactNode, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

interface AnalyticsWrapperProps {
  children: ReactNode
  pageEvent: string
}

export default function AnalyticsWrapper({ children, pageEvent }: AnalyticsWrapperProps) {
  useEffect(() => {
    // Track page view
    trackEvent(pageEvent)

    // Track page load
    const onLoad = () => {
      trackEvent("page_loaded")
    }

    // Track scroll depth
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.offsetHeight
      const winHeight = window.innerHeight
      const scrollPercent = scrollTop / (docHeight - winHeight)

      if (scrollPercent > 0.25 && !window.scrollTracked25) {
        window.scrollTracked25 = true
        trackEvent("scroll_depth", { depth: "25%" })
      }

      if (scrollPercent > 0.5 && !window.scrollTracked50) {
        window.scrollTracked50 = true
        trackEvent("scroll_depth", { depth: "50%" })
      }

      if (scrollPercent > 0.75 && !window.scrollTracked75) {
        window.scrollTracked75 = true
        trackEvent("scroll_depth", { depth: "75%" })
      }

      if (scrollPercent > 0.9 && !window.scrollTracked90) {
        window.scrollTracked90 = true
        trackEvent("scroll_depth", { depth: "90%" })
      }
    }

    window.addEventListener("load", onLoad)
    window.addEventListener("scroll", onScroll)

    // Cleanup
    return () => {
      window.removeEventListener("load", onLoad)
      window.removeEventListener("scroll", onScroll)
    }
  }, [pageEvent])

  return <>{children}</>
}
