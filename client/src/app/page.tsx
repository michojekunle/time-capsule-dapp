"use client";

import { useState } from "react";
import { useActiveAccount, useReadContract, ConnectButton } from "thirdweb/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";
import { client } from "@/lib/config";
import { contract } from "@/lib/contract";
import CreateCapsuleDialog from "@/components/create-capsule-dialog";
import CapsuleCard from "@/components/capsule-card";
import AllCapsules from "@/components/all-capsules";
import GettingStarted from "@/components/getting-started";
import CapsuleStats from "@/components/capsule-stats";

export default function HomePage() {
  const account = useActiveAccount();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: myCapsuleIds, isLoading: loadingMyCapsules } = useReadContract({
    contract,
    method:
      "function getCapsulesByCreator(address _creator) view returns (uint256[])",
    params: [account?.address || "0x0"],
    queryOptions: {
      enabled: !!account?.address,
    },
  });

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">TimeCapsule DApp</CardTitle>
            <CardDescription>
              Create and discover time capsules on the blockchain. Connect your
              wallet to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <ConnectButton
              client={client}
              theme="light"
              connectModal={{
                size: "wide",
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              TimeCapsule DApp
            </h1>
            <p className="text-gray-600">
              Create and discover time capsules on the blockchain
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Capsule
            </Button>
            <ConnectButton
              client={client}
              theme="light"
              connectModal={{
                size: "compact",
              }}
            />
          </div>
        </div>

        {/* Getting Started */}
        <div className="space-y-4 mb-8">
          <GettingStarted onCreateCapsule={() => setIsCreateDialogOpen(true)} />
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <CapsuleStats />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="my-capsules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-capsules">My Capsules</TabsTrigger>
            <TabsTrigger value="all-capsules">All Capsules</TabsTrigger>
          </TabsList>

          <TabsContent value="my-capsules" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                My Time Capsules
              </h2>
              <Badge variant="secondary">
                {myCapsuleIds?.length || 0} capsules
              </Badge>
            </div>

            {loadingMyCapsules ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myCapsuleIds && myCapsuleIds?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCapsuleIds.map((id: bigint) => (
                  <CapsuleCard key={id.toString()} capsuleId={id.toString()} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No capsules yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first time capsule to get started
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Capsule
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all-capsules">
            <AllCapsules />
          </TabsContent>
        </Tabs>

        <CreateCapsuleDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      </div>
    </div>
  );
}
