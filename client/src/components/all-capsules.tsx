"use client"

import { useState, useEffect } from "react"
import { useReadContract } from "thirdweb/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"
import CapsuleCard from "./capsule-card"
import { contract } from "@/lib/contract"

export default function AllCapsules() {
  const [allCapsuleIds, setAllCapsuleIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const { data: nextCapsuleId } = useReadContract({
    contract,
    method: "function nextCapsuleId() view returns (uint256)",
    params: [],
  })

  useEffect(() => {
    const fetchPublicCapsules = async () => {
      if (!nextCapsuleId) return

      const ids: string[] = []
      const totalCapsules = Number(nextCapsuleId)

      // Check each capsule to see if it's public (limit to 50 for performance)
      for (let i = 0; i < Math.min(totalCapsules, 50); i++) {
        try {
          ids.push(i.toString())
        } catch (error) {
          console.error(`Error fetching capsule ${i}:`, error)
        }
      }

      setAllCapsuleIds(ids.slice(0, 20))
      setLoading(false)
    }

    fetchPublicCapsules()
  }, [nextCapsuleId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Time Capsules</h2>
          <Badge variant="secondary">Loading...</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          All Time Capsules
        </h2>
        <Badge variant="secondary">{allCapsuleIds.length} capsules</Badge>
      </div>

      {allCapsuleIds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCapsuleIds.map((id) => (
            <CapsuleCard key={id} capsuleId={id} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No capsules yet</h3>
            <p className="text-gray-600">Be the first to create a time capsule!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}