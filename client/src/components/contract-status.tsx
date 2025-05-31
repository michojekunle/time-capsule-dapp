"use client"

import { useReadContract } from "thirdweb/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react"
import { contract } from "@/lib/contract"

export default function ContractStatus() {
  const {
    data: nextCapsuleId,
    isLoading,
    error,
  } = useReadContract({
    contract,
    method: "function nextCapsuleId() view returns (uint256)",
    params: [],
  })

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"

  const getExplorerUrl = (address: string) => {
    const explorers: Record<string, string> = {
      "1": "https://etherscan.io",
      "137": "https://polygonscan.com",
      "10": "https://optimistic.etherscan.io",
      "42161": "https://arbiscan.io",
      "11155111": "https://sepolia.etherscan.io",
      "80001": "https://mumbai.polygonscan.com",
    }
    return `${explorers[chainId] || "https://etherscan.io"}/address/${address}`
  }

  if (!contractAddress) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment variables.
        </AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Failed to connect to contract. Please check your contract address and network configuration.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 text-sm">Connecting to contract...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800 text-sm font-medium">Contract Connected</span>
            <Badge variant="outline" className="text-xs">
              {nextCapsuleId?.toString() || "0"} capsules created
            </Badge>
          </div>
          <a
            href={getExplorerUrl(contractAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900"
          >
            View on Explorer
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
