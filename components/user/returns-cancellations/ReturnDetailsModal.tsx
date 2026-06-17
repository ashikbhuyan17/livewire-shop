"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ReturnDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  returnItem: any;
}

export default function ReturnDetailsModal({
  isOpen,
  onClose,
  returnItem,
}: ReturnDetailsModalProps) {
  if (!returnItem) return null;

  const getStatusBadgeVariant = (statusType: string) => {
    switch (statusType) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Return Request Details</DialogTitle>
          <DialogDescription>
            View the details of your return or cancellation request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Image
                  width={1200}
                  height={1200}
                  src={returnItem.product.image || "/placeholder.svg"}
                  alt={returnItem.product.name}
                  className="w-20 h-20 rounded object-cover bg-muted"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {returnItem.product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Order ID: {returnItem.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Date Requested
                </p>
                <p className="font-medium text-foreground">
                  {new Date(returnItem.dateRequested).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge
                  className={`${getStatusBadgeVariant(
                    returnItem.statusType
                  )} border-0`}
                >
                  {returnItem.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Refund Amount
              </p>
              <p className="font-medium text-foreground">
                {returnItem.refundAmount}
              </p>
            </div>
          </div>

          {/* Customer Message */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Your Message
            </p>
            <Card className="border-border bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm text-foreground">{returnItem.reason}</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Response */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Admin Response
            </p>
            <Card className="border-border bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm text-foreground">
                  Thank you for your request. We have reviewed your case and
                  approved your return. Please expect a refund within 5-7
                  business days.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
