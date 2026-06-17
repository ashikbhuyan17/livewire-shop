"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const faqs = [
  {
    id: "track-order",
    question: "How can I track my order?",
    answer:
      'You can track your order in real-time through your account dashboard. Once your order is confirmed, you\'ll receive a tracking link via email. You can also check the status by going to "My Orders" in your account settings.',
  },
  {
    id: "delayed-delivery",
    question: "What if my delivery is delayed?",
    answer:
      "If your delivery is delayed beyond the estimated time window, please contact our support team immediately. We offer a 10% refund on your order or a credit toward your next purchase as compensation for the inconvenience.",
  },
  {
    id: "return-policy",
    question: "What is your return and refund policy?",
    answer:
      "We offer a 7-day return policy for unopened items in original condition. Perishable items can be returned within 24 hours if they arrive damaged. Refunds are processed within 5-7 business days after we receive and inspect the returned items.",
  },
  {
    id: "payment-methods",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), digital wallets (Apple Pay, Google Pay), and bank transfers. We also offer installment payment options for orders over $100.",
  },
  {
    id: "subscription",
    question: "Do you offer subscription or recurring delivery?",
    answer:
      "Yes! Our subscription service allows you to set up recurring deliveries for your favorite items. You can customize frequency, items, and delivery dates. Subscribers enjoy 15% off their orders and free delivery on all purchases.",
  },
  {
    id: "allergen-info",
    question: "How can I find allergen information for products?",
    answer:
      "Each product page includes detailed allergen information. You can also filter products by allergens in our advanced search. If you have specific dietary concerns, our support team can provide personalized recommendations.",
  },
];

export default function FAQSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find quick answers to common questions about orders, delivery, and
            more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <motion.div key={faq.id} variants={itemVariants}>
                  <AccordionItem value={faq.id} className="border-border/30">
                    <AccordionTrigger className="hover:text-accent hover:no-underline">
                      <span className="text-left font-medium text-foreground">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
