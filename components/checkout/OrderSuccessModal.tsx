"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface OrderData {
  invoice_id?: number;
  amount: number;
  discount: number;
  shipping_charge: string | number;
  customer_id: string;
  order_status: number;
  note?: string;
  created_at: string;
  id: number;
}

interface OrderSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData?: OrderData;
}

export default function OrderSuccessModal({
  open,
  onOpenChange,
  orderData,
}: OrderSuccessModalProps) {
  const router = useRouter();

  const handleContinueShopping = () => {
    onOpenChange(false);
    router.push("/");
  };

  const formatOrderCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!orderData) return 0;
    return orderData?.amount - orderData?.discount;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border/50 bg-card shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.3 },
          }}
          className="flex flex-col items-center text-center px-4 py-6"
        >
          {/* Success icon with elegant animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-success/10 rounded-full blur-2xl scale-150" />
            <div className="relative rounded-full bg-success-light p-5 ring-1 ring-success/20">
              <CheckCircle2
                className="h-16 w-16 text-success"
                strokeWidth={1.5}
              />
            </div>

            {/* Decorative sparkles */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles
                className="h-6 w-6 text-success/60"
                fill="currentColor"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="absolute -bottom-1 -left-2"
            >
              <Sparkles
                className="h-5 w-5 text-success/40"
                fill="currentColor"
              />
            </motion.div>
          </motion.div>

          <DialogHeader className="space-y-4 mb-6">
            <DialogTitle className="text-4xl font-serif font-normal tracking-tight text-balance">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your order has been placed successfully. We&apos;ll send you a
              confirmation email shortly.
            </DialogDescription>
          </DialogHeader>

          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full mb-8 bg-muted/30 rounded-2xl p-6 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-4 text-foreground/80">
                <Receipt className="h-4 w-4" />
                <span className="text-sm font-medium">Order Details</span>
              </div>

              <div className="space-y-3 text-sm">
                {/* Invoice ID */}
                {/* <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Invoice ID</span>
                  <span className="font-medium text-foreground">
                    #{orderData?.invoice_id}
                  </span>
                </div> */}

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    {formatOrderCurrency(
                      orderData?.amount - Number(orderData?.shipping_charge)
                    )}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {formatOrderCurrency(
                      typeof orderData?.shipping_charge === "string"
                        ? Number.parseFloat(orderData?.shipping_charge)
                        : orderData?.shipping_charge
                    )}
                  </span>
                </div>

                {/* Discount (only show if > 0) */}
                {orderData?.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-success">
                      -{formatOrderCurrency(orderData?.discount)}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* Total */}
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-lg text-foreground">
                    {formatOrderCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <Button
            onClick={handleContinueShopping}
            className="w-full sm:w-auto min-w-[200px] h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
