import type { Metadata } from "next"
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const siteDescription =
  "Catch bad trading decisions in time, explain why with evidence, and help fix the strategy before more capital gets buried."

function getMetadataBase(): URL {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (appUrl) {
    return new URL(appUrl.endsWith("/") ? appUrl : `${appUrl}/`)
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (productionHost) {
    return new URL(`https://${productionHost}/`)
  }

  const vercelHost = process.env.VERCEL_URL?.trim()
  if (vercelHost) {
    return new URL(`https://${vercelHost}/`)
  }

  return new URL("http://localhost:3000/")
}

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
  metadataBase: getMetadataBase(),
  title: "Mortem",
  description: siteDescription,
  openGraph: {
    title: "Mortem",
    description: siteDescription,
    siteName: "Mortem",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 854,
        height: 481,
        alt: "Mortem — catch bad trading decisions before more capital gets buried",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortem",
    description: siteDescription,
    images: ["/twitter-image.png"],
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
