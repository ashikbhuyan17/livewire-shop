"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const hours = [
  { day: "Monday", time: "8:00 AM - 10:00 PM" },
  { day: "Tuesday", time: "8:00 AM - 10:00 PM" },
  { day: "Wednesday", time: "8:00 AM - 10:00 PM" },
  { day: "Thursday", time: "8:00 AM - 10:00 PM" },
  { day: "Friday", time: "8:00 AM - 10:00 PM" },
  { day: "Saturday", time: "9:00 AM - 8:00 PM" },
  { day: "Sunday", time: "Closed" },
];

export default function SupportHours() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.05 },
    }),
  };

  const today = new Date().getDay();
  const isOpen = today !== 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Support Hours
            </CardTitle>
            <Badge
              variant={isOpen ? "default" : "secondary"}
              className="bg-accent/20 text-accent"
            >
              {isOpen ? "Open Now" : "Closed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {hours.map((item, index) => (
              <motion.div
                key={item.day}
                custom={index}
                variants={itemVariants}
                className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
              >
                <span className="text-sm font-medium text-foreground">
                  {item.day}
                </span>
                <span
                  className={`text-sm ${
                    item.time === "Closed"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.time}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
