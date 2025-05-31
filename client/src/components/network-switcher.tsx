"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

const networks = [
  { id: "1", name: "Ethereum", icon: "🔷", testnet: false },
  { id: "137", name: "Polygon", icon: "🟣", testnet: false },
  { id: "10", name: "Optimism", icon: "🔴", testnet: false },
  { id: "42161", name: "Arbitrum", icon: "🔵", testnet: false },
  { id: "11155111", name: "Sepolia", icon: "🔷", testnet: true },
  { id: "80001", name: "Mumbai", icon: "🟣", testnet: true },
]

export default function NetworkSwitcher() {
  const currentChainId = process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"
  const currentNetwork = networks.find((n) => n.id === currentChainId) || networks[4]

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 text-sm font-medium">Network</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentNetwork.icon}</span>
            <span className="text-sm font-medium">{currentNetwork.name}</span>
            {currentNetwork.testnet && (
              <Badge variant="outline" className="text-xs">
                Testnet
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-2">
          To switch networks, update NEXT_PUBLIC_CHAIN_ID in your environment variables and redeploy.
        </p>
      </CardContent>
    </Card>
  )
}
