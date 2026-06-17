"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const contactDetails = [
  {
    icon: MapPin,
    title: "Address",
    content: "123 Fresh Market Lane\nGreen Valley, CA 94025",
    color: "text-primary",
  },
  {
    icon: Mail,
    title: "Email",
    content: "hello@freshgrocery.com\nsupport@freshgrocery.com",
    color: "text-primary",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (555) 123-4567\n+1 (555) 123-4568",
    color: "text-primary",
  },
  {
    icon: Clock,
    title: "Business Hours",
    content: "Mon - Fri: 8:00 AM - 8:00 PM\nSat - Sun: 9:00 AM - 6:00 PM",
    color: "text-primary",
  },
];

function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-4"
    >
      {contactDetails.map((detail, index) => {
        const Icon = detail.icon;
        return (
          <motion.div
            key={detail.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-primary/20 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 bg-primary/10 rounded-lg ${detail.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg text-foreground font-sans">
                    {detail.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed font-sans">
                  {detail.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default ContactInfo;
