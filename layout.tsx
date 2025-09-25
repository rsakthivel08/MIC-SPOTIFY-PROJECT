import React from "react"
import { Inter, Montserrat } from "next/font/google"
import "./global.css"

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserratFont = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

export const metadata = {
  title: "AI Mood-Based Playlist Generator",
  description: "Generate playlists based on your mood using AI and Spotify",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interFont.variable} ${montserratFont.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  )
}
