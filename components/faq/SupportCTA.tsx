"use client";

import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SupportCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8 sm:p-10">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="mt-2 text-muted-foreground">
            Our support team is ready to help you with any questions or
            concerns.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
              >
                <Mail className="h-5 w-5" />
                Contact Us
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 sm:w-auto bg-transparent"
              >
                <Phone className="h-5 w-5" />
                Call Support
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
