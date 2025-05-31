"use client";

import type React from "react";

import { useState } from "react";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calendar, Lock, Globe } from "lucide-react";
import { toast } from "sonner";
import { contract } from "@/lib/contract";

interface CreateCapsuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCapsuleDialog({
  isOpen,
  onClose,
}: CreateCapsuleDialogProps) {
  const [message, setMessage] = useState("");
  const [daysInFuture, setDaysInFuture] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [newAttachment, setNewAttachment] = useState("");

  const { mutate: sendAndConfirmTransaction, isPending } =
    useSendAndConfirmTransaction();

  const addAttachment = () => {
    if (newAttachment.trim() && attachments.length < 5) {
      setAttachments([...attachments, newAttachment.trim()]);
      setNewAttachment("");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !daysInFuture) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (Number.parseInt(daysInFuture) <= 0) {
      toast.error("Days in future must be greater than 0");
      return;
    }

    try {
      const transaction = prepareContractCall({
        contract,
        method:
          "function createCapsule(string memory _message, uint256 _daysInFuture, bool _isPrivate, string[] memory _attachments) returns (uint256)",
        params: [message, BigInt(daysInFuture), isPrivate, attachments],
      });

      // @ts-ignore
      sendAndConfirmTransaction(transaction, {
        onSuccess: () => {
          toast.success("Time capsule created successfully!");
          // Reset form
          setMessage("");
          setDaysInFuture("");
          setIsPrivate(false);
          setAttachments([]);
          setNewAttachment("");
          onClose();
        },
        onError: (error) => {
          console.error("Error creating capsule:", error);
          toast.error("Failed to create time capsule");
        },
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      toast.error("Failed to prepare transaction");
    }
  };

  const unlockDate = daysInFuture
    ? new Date(
        Date.now() + Number.parseInt(daysInFuture) * 24 * 60 * 60 * 1000
      ).toLocaleDateString()
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Create Time Capsule
          </DialogTitle>
          <DialogDescription>
            Create a message that will be unlocked in the future. Add
            attachments and choose privacy settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
                id="message"
                placeholder="Write your message for the future..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                required
                style={{ width: "460px", height: "150px", minWidth: "400px", maxWidth: "640px", minHeight: "150px", maxHeight: "180px" }}
                className="resize-none"
            />
            <p className="text-sm text-gray-500">
              {message.length}/1000 characters
            </p>
          </div>

          {/* Days in Future */}
          <div className="space-y-2">
            <Label htmlFor="days">Days in Future *</Label>
            <Input
              id="days"
              type="number"
              placeholder="e.g., 365"
              value={daysInFuture}
              onChange={(e) => setDaysInFuture(e.target.value)}
              min="1"
              required
            />
            {unlockDate && (
              <p className="text-sm text-gray-500">
                Will unlock on: {unlockDate}
              </p>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {isPrivate ? (
                <Lock className="w-5 h-5 text-gray-600" />
              ) : (
                <Globe className="w-5 h-5 text-gray-600" />
              )}
              <div>
                <Label htmlFor="privacy">Private Capsule</Label>
                <p className="text-sm text-gray-500">
                  {isPrivate
                    ? "Only you can open this capsule"
                    : "Anyone can open this capsule after unlock time"}
                </p>
              </div>
            </div>
            <Switch
              id="privacy"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <Label>Attachments (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add URL or text attachment"
                value={newAttachment}
                onChange={(e) => setNewAttachment(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAttachment())
                }
              />
              <Button
                type="button"
                onClick={addAttachment}
                disabled={!newAttachment.trim() || attachments.length >= 5}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded min-w-0"
                  >
                    <span className="flex-1 text-sm break-all overflow-hidden text-ellipsis min-w-0">
                      {attachment}
                    </span>
                    <Button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <p className="text-sm text-gray-500">
                  {attachments.length}/5 attachments
                </p>
              </div>
            )}
          </div>

          {/* Preview Card */}
          {(message || daysInFuture) && (
            <Card className="bg-purple-50 border-purple-200 w-[460px]">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Preview
                  <Badge variant={isPrivate ? "secondary" : "outline"}>
                    {isPrivate ? "Private" : "Public"}
                  </Badge>
                </h4>
                <p className="text-sm text-gray-600 mb-2 break-words">
                  {message || "Your message will appear here..."}
                </p>
                {unlockDate && (
                  <p className="text-xs text-purple-600">
                    Unlocks: {unlockDate}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !message.trim() || !daysInFuture}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isPending ? "Creating..." : "Create Capsule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}