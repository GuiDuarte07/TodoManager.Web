import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Todo Manager",
  description: "Plataforma de gestão de tarefas.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  )
}
