"use client";

import { useState } from "react";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Lock, Unlock, Eye, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { contract } from "@/lib/contract";

interface CapsuleCardProps {
  capsuleId: string;
}

export default function CapsuleCard({ capsuleId }: CapsuleCardProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: capsuleDetails, refetch: refetchDetails } = useReadContract({
    contract,
    method:
      "function getCapsuleDetails(uint256 _id) view returns (address creator, uint256 unlockTime, bool isPrivate, bool isOpened, address opener)",
    params: [BigInt(capsuleId)],
  });

  const { data: capsuleContent, refetch: refetchContent } = useReadContract({
    contract,
    method:
      "function viewCapsule(uint256 _id) view returns (string message, string[] attachments)",
    params: [BigInt(capsuleId)],
    queryOptions: {
      enabled: false, // Only fetch when needed
    },
  });

  const { mutate: sendAndConfirmTransaction, isPending: isOpening } =
    useSendAndConfirmTransaction();

  if (!capsuleDetails) return null;

  const [creator, unlockTime, isPrivate, isOpened, opener] = capsuleDetails;
  const unlockDate = new Date(Number(unlockTime) * 1000);
  const isUnlocked = Date.now() >= unlockDate.getTime();
  const canOpen = isUnlocked && !isOpened;

  const handleOpen = async () => {
    try {
      const transaction = prepareContractCall({
        contract,
        method: "function openCapsule(uint256 _id)",
        params: [BigInt(capsuleId)],
      });

      sendAndConfirmTransaction(transaction, {
        onSuccess: () => {
          toast.success("Capsule opened successfully!");
          refetchDetails();
          refetchContent();
        },
        onError: (error) => {
          console.error("Error opening capsule:", error);
          toast.error("Failed to open capsule");
        },
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      toast.error("Failed to prepare transaction");
    }
  };

  const handleView = () => {
    if (isOpened || (isPrivate && creator)) {
      refetchContent();
      setIsViewDialogOpen(true);
    } else if (!isUnlocked) {
      toast.error("Capsule is still locked");
    } else {
      toast.error("You cannot view this private capsule");
    }
  };

  return (
    <>
      <Card
        className={`transition-all hover:shadow-lg ${
          isUnlocked ? "border-green-200 bg-green-50" : "border-gray-200"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Capsule #{capsuleId}</CardTitle>
            <div className="flex gap-2">
              <Badge variant={isPrivate ? "secondary" : "outline"}>
                {isPrivate ? (
                  <Lock className="w-3 h-3 mr-1" />
                ) : (
                  <Unlock className="w-3 h-3 mr-1" />
                )}
                {isPrivate ? "Private" : "Public"}
              </Badge>
              {isOpened && (
                <Badge variant="default" className="bg-green-600">
                  Opened
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {isUnlocked
              ? "Unlocked"
              : `Unlocks ${unlockDate.toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>
              Creator: {creator.slice(0, 6)}...{creator.slice(-4)}
            </span>
          </div>

          {isOpened && opener && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>
                Opened by: {opener.slice(0, 6)}...{opener.slice(-4)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span className={isUnlocked ? "text-green-600" : "text-orange-600"}>
              {isUnlocked
                ? "Ready to open"
                : `${Math.ceil(
                    (unlockDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )} days remaining`}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            {canOpen && (
              <Button
                onClick={handleOpen}
                disabled={isOpening}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isOpening ? "Opening..." : "Open Capsule"}
              </Button>
            )}

            <Button
              onClick={handleView}
              variant="outline"
              className="flex-1"
              disabled={!isOpened && (!isUnlocked || isPrivate)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Capsule #{capsuleId}</DialogTitle>
            <DialogDescription>
              Created on{" "}
              {new Date(
                Number(unlockTime) * 1000 -
                  Number.parseInt(capsuleId) * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {capsuleContent && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Message</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{capsuleContent[0]}</p>
                </div>
              </div>

              {capsuleContent[1] && capsuleContent[1].length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {capsuleContent[1].map(
                      (attachment: string, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded border"
                        >
                          <p className="text-sm break-all">{attachment}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
