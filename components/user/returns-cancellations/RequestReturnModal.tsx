"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RequestReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestReturnModal({
  isOpen,
  onClose,
}: RequestReturnModalProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    productName: "",
    requestType: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    onClose();
    setFormData({ orderId: "", productName: "", requestType: "", reason: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Return or Cancellation</DialogTitle>
          <DialogDescription>
            Fill out the form below to request a return or cancellation for your
            order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Order ID */}
          <div className="space-y-2">
            <Label htmlFor="orderId" className="text-foreground font-medium">
              Order ID
            </Label>
            <Select
              value={formData.orderId}
              onValueChange={(value) => handleChange("orderId", value)}
            >
              <SelectTrigger id="orderId" className="border-border">
                <SelectValue placeholder="Select an order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORD-001">
                  ORD-001 - Organic Tomatoes
                </SelectItem>
                <SelectItem value="ORD-002">
                  ORD-002 - Whole Wheat Bread
                </SelectItem>
                <SelectItem value="ORD-003">ORD-003 - Greek Yogurt</SelectItem>
                <SelectItem value="ORD-004">ORD-004 - Almond Milk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label
              htmlFor="productName"
              className="text-foreground font-medium"
            >
              Product Name
            </Label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              className="border-border bg-background text-foreground"
            />
          </div>

          {/* Request Type */}
          <div className="space-y-2">
            <Label
              htmlFor="requestType"
              className="text-foreground font-medium"
            >
              Request Type
            </Label>
            <Select
              value={formData.requestType}
              onValueChange={(value) => handleChange("requestType", value)}
            >
              <SelectTrigger id="requestType" className="border-border">
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="cancellation">Cancellation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-foreground font-medium">
              Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Please explain the reason for your return or cancellation..."
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              className="border-border bg-background text-foreground min-h-24 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
