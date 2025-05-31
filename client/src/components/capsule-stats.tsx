"use client"

import { useActiveAccount, useReadContract } from "thirdweb/react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Unlock, Package, Calendar } from "lucide-react"
import { contract } from "@/lib/contract"

export default function CapsuleStats() {
  const account = useActiveAccount()

  const { data: myCapsuleIds } = useReadContract({
    contract,
    method: "function getCapsulesByCreator(address _creator) view returns (uint256[])",
    params: [account?.address || "0x0"],
    queryOptions: {
      enabled: !!account?.address,
    },
  })

  const { data: totalCapsules } = useReadContract({
    contract,
    method: "function nextCapsuleId() view returns (uint256)",
    params: [],
  })

  // Calculate stats (in a real app, you'd fetch this data more efficiently)
  const myCapsulesCount = myCapsuleIds?.length || 0
  const totalCapsulesCount = totalCapsules ? Number(totalCapsules) : 0

  const stats = [
    {
      icon: Package,
      label: "My Capsules",
      value: myCapsulesCount,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Calendar,
      label: "Total Created",
      value: totalCapsulesCount,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Clock,
      label: "Pending",
      value: "-", // Would calculate from capsule details
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Unlock,
      label: "Opened",
      value: "-", // Would calculate from capsule details
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
