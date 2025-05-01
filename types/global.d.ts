interface Window {
  mixpanel?: {
    track: (event: string, properties?: Record<string, any>) => void
    init: (token: string) => void
  }
  fbq?: (event: string, name: string, properties?: Record<string, any>) => void
  scrollTracked25: boolean
  scrollTracked50: boolean
  scrollTracked75: boolean
  scrollTracked90: boolean
}
