"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { mockOrders } from "@/lib/mock-orders";
import Image from "next/image";

interface OrderDetailsModalProps {
  order: (typeof mockOrders)[0];
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!isOpen) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Processing":
        return "secondary";
      case "On The Way":
        return "outline";
      case "Pending":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col border-border shadow-lg">
          {/* Header */}
          <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b border-border pb-4 flex-shrink-0">
            <div>
              <CardTitle className="text-2xl">Order Details</CardTitle>
              <CardDescription className="mt-1">{order.id}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>

          <CardContent className="pt-6 overflow-y-auto flex-1">
            {/* Order Info Grid */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Order Date
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Status
                </p>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Payment Method
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Delivery Address
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {order.deliveryAddress}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Items Section */}
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Order Items
              </h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg border border-border p-3"
                  >
                    {/* Item Image */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        width={1200}
                        height={1200}
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Item Price */}
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium text-foreground">
                  ${order.deliveryFee.toFixed(2)}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">
                  Grand Total
                </span>
                <span className="text-lg font-bold text-foreground">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>

          <div className="border-t border-border p-6 flex-shrink-0">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={onClose}
              >
                Close
              </Button>
              <Button className="flex-1">Reorder</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
