import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { PopupProvider } from "@/components/popup-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "GCETT Student Directory Portal",
  description: "Connect with fellow students at Government College of Engineering & Textile Technology",
  generator: "Swarnendu Majumder",
  icons: {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuudIfuLkPnBXs1MwWOEGgzRwyFuPza_zAFw&s",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <PopupProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </PopupProvider>
        <Analytics />
      </body>
    </html>
  )
}
