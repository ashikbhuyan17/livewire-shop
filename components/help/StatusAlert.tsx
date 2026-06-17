"use client";

import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function StatusAlert() {
  return (
    <motion.div
      className="border-b border-border bg-secondary/50 px-4 py-3 sm:px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-6xl">
        <Alert className="border-accent/30 bg-accent/5">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription className="text-sm text-foreground">
            <span className="font-semibold">High call volume today</span> —
            We&apos;re experiencing higher than usual inquiries. Expected
            response time: 2-3 hours. Thank you for your patience!
          </AlertDescription>
        </Alert>
      </div>
    </motion.div>
  );
}
