import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThirdwebProvider } from "thirdweb/react"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TimeCapsule DApp",
  description: "Create and discover time capsules on the blockchain",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          {children}
          <Toaster position="top-right" />
        </ThirdwebProvider>
      </body>
    </html>
  )
}
