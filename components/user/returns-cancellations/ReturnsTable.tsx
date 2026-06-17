"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";

interface ReturnsTableProps {
  onViewDetails: (item: unknown) => void;
}

export default function ReturnsTable({ onViewDetails }: ReturnsTableProps) {
  // Mock data - replace with real data from API
  const returns = [
    {
      id: "ORD-001",
      product: {
        name: "Organic Tomatoes (1kg)",
        image:
          "https://images.unsplash.com/photo-1647377502180-7604b5470dbe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1025",
      },
      dateRequested: "2024-10-20",
      status: "Return Approved",
      statusType: "approved",
      reason: "Product damaged during delivery",
      refundAmount: "$12.99",
    },
    {
      id: "ORD-002",
      product: {
        name: "Whole Wheat Bread",
        image:
          "https://images.unsplash.com/photo-1647377502180-7604b5470dbe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1025",
      },
      dateRequested: "2024-10-18",
      status: "Refunded",
      statusType: "refunded",
      reason: "Expired before delivery",
      refundAmount: "$4.50",
    },
    {
      id: "ORD-003",
      product: {
        name: "Greek Yogurt (500g)",
        image:
          "https://images.unsplash.com/photo-1647377502180-7604b5470dbe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1025",
      },
      dateRequested: "2024-10-15",
      status: "Return Requested",
      statusType: "pending",
      reason: "Wrong item received",
      refundAmount: "Pending",
    },
    {
      id: "ORD-004",
      product: {
        name: "Almond Milk (1L)",
        image:
          "https://images.unsplash.com/photo-1647377502180-7604b5470dbe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1025",
      },
      dateRequested: "2024-10-10",
      status: "Cancelled",
      statusType: "cancelled",
      reason: "Order cancelled by customer",
      refundAmount: "$6.99",
    },
  ];

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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Order ID
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Product
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Date Requested
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Reason
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Refund
            </th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {returns.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="py-4 px-4 text-foreground font-medium">
                {item.id}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Image
                    width={1200}
                    height={1200}
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-12 h-12 rounded object-cover bg-muted"
                  />
                  <span className="text-foreground text-sm">
                    {item.product.name}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-foreground text-sm">
                {new Date(item.dateRequested).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <Badge
                  className={`${getStatusBadgeVariant(
                    item.statusType
                  )} border-0`}
                >
                  {item.status}
                </Badge>
              </td>
              <td className="py-4 px-4 text-foreground text-sm max-w-xs truncate">
                {item.reason}
              </td>
              <td className="py-4 px-4 text-foreground font-medium text-sm">
                {item.refundAmount}
              </td>
              <td className="py-4 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(item)}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
