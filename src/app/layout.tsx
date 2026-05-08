import type { Metadata } from "next"
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["400", "500", "600", "700", "800"],
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Mortem",
  description:
    "Catch bad trading decisions in time, explain why with evidence, and help fix the strategy before more capital gets buried.",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <meta property="og:site_name" content="Mortem."></meta>
      <meta property="og:url" content="https://x.com/mortemlabs"></meta>
      <body
        className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
