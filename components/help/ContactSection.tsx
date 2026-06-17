"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail } from "lucide-react";

export default function ContactSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.1 },
    }),
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            Connect with our support team directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Call Support Button */}
          <motion.div
            custom={0}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              className="w-full gap-2 bg-primary hover:bg-primary/90"
              size="lg"
              onClick={() => (window.location.href = "tel:+1-800-GROCERY")}
            >
              <Phone className="h-4 w-4" />
              Call Support
            </Button>
          </motion.div>

          {/* Live Chat Button */}
          <motion.div
            custom={1}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              className="w-full gap-2 border-primary/30 bg-secondary hover:bg-secondary/80"
              variant="outline"
              size="lg"
              onClick={() => {
                // Placeholder for live chat integration
                alert("Live chat feature coming soon!");
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Start Live Chat
            </Button>
          </motion.div>

          {/* Email Support */}
          <motion.div
            custom={2}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="rounded-lg border border-border/30 bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Email Support
                  </p>
                  <a
                    href="mailto:support@groceryshop.com"
                    className="text-sm text-primary hover:underline"
                  >
                    support@groceryshop.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="text-xs text-muted-foreground">
            Average response time: 2-3 hours during business hours
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
