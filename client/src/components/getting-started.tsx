"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Rocket, Package, Clock, Users } from "lucide-react"

interface GettingStartedProps {
  onCreateCapsule: () => void
}

export default function GettingStarted({ onCreateCapsule }: GettingStartedProps) {
  const [isOpen, setIsOpen] = useState(true)

  const features = [
    {
      icon: Package,
      title: "Create Time Capsules",
      description: "Write messages and add attachments to be unlocked in the future",
      color: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Set Unlock Times",
      description: "Choose when your capsules will be available to open",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Privacy Controls",
      description: "Make capsules private (only you can open) or public (anyone can open)",
      color: "text-green-600",
    },
  ]

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-white/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Getting Started</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <CardDescription>Learn how to use the TimeCapsule DApp</CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                  <feature.icon className={`h-5 w-5 ${feature.color} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h3 className="font-medium text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/60 rounded-lg p-4">
              <h3 className="font-medium mb-2">Quick Start Guide</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Click "Create Capsule" to write your first message</li>
                <li>Set how many days in the future it should unlock</li>
                <li>Choose if it should be private or public</li>
                <li>Add any attachments (URLs, text, etc.)</li>
                <li>Submit the transaction to create your capsule</li>
                <li>Wait for the unlock time to open and view your message!</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button onClick={onCreateCapsule} className="bg-purple-600 hover:bg-purple-700">
                <Package className="w-4 h-4 mr-2" />
                Create Your First Capsule
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Got it, thanks!
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
