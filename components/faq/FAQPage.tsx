"use client";

import { useState, useMemo } from "react";
import { easeOut, motion } from "framer-motion";
import { Box, CreditCard, Gift, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FAQHero from "@/components/faq/FAQHero";
import FAQAccordionSection from "@/components/faq/FAQAccordionSection";
import SupportCTA from "@/components/faq/SupportCTA";

const CATEGORIES = [
  {
    id: "orders",
    label: "Orders & Delivery",
    icon: <Box size={15} className="mr-2" />,
  },
  {
    id: "payments",
    label: "Payments & Refunds",
    icon: <CreditCard size={15} className="mr-2" />,
  },
  {
    id: "account",
    label: "Account & Profile",
    icon: <User size={15} className="mr-2" />,
  },
  {
    id: "offers",
    label: "Offers & Coupons",
    icon: <Gift size={15} className="mr-2" />,
  },
];

const FAQ_DATA = [
  {
    category: "orders",
    questions: [
      {
        id: "q1",
        question: "How do I track my order?",
        answer:
          'You can track your order in real-time through your account dashboard. Once your order is confirmed, you\'ll receive a tracking link via email and SMS. You can also check the status anytime by visiting the "My Orders" section in your profile.',
      },
      {
        id: "q2",
        question: "Can I schedule my delivery?",
        answer:
          "Yes! During checkout, you can select your preferred delivery date and time slot. We offer same-day delivery in most areas and scheduled delivery up to 7 days in advance. Choose the slot that works best for you.",
      },
      {
        id: "q3",
        question: "What is your delivery fee?",
        answer:
          "Delivery fees vary based on your location and order value. Orders above $50 qualify for free delivery. For smaller orders, the delivery fee is typically $2-5. You'll see the exact fee before confirming your order.",
      },
    ],
  },
  {
    category: "payments",
    questions: [
      {
        id: "q4",
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, digital wallets (Apple Pay, Google Pay), and bank transfers. All payments are secured with industry-standard encryption.",
      },
      {
        id: "q5",
        question: "How do I get a refund?",
        answer:
          "If you're unsatisfied with your order, contact our support team within 24 hours of delivery. We offer full refunds for damaged or missing items. Refunds are processed within 3-5 business days to your original payment method.",
      },
      {
        id: "q6",
        question: "Is my payment information secure?",
        answer:
          "We use PCI-DSS compliant payment processing and never store your full card details. All transactions are encrypted with SSL technology to protect your sensitive information.",
      },
    ],
  },
  {
    category: "account",
    questions: [
      {
        id: "q7",
        question: "How do I create an account?",
        answer:
          'Click the "Sign Up" button on our homepage and enter your email address. You\'ll receive a verification link via email. Complete the verification and set up your profile with your delivery address and preferences.',
      },
      {
        id: "q8",
        question: "Can I update my delivery address?",
        answer:
          "Yes, you can update your delivery address anytime in your account settings. If you need to change it for an active order, contact our support team immediately. Changes can only be made before the order is dispatched.",
      },
      {
        id: "q9",
        question: "How do I reset my password?",
        answer:
          'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link via email. Click the link and create a new password. For security, this link expires after 24 hours.',
      },
    ],
  },
  {
    category: "offers",
    questions: [
      {
        id: "q10",
        question: "How do I apply a coupon code?",
        answer:
          'During checkout, you\'ll see a "Promo Code" field. Enter your coupon code and click "Apply". The discount will be calculated automatically. Make sure the code is valid and meets the minimum order requirements.',
      },
      {
        id: "q11",
        question: "Do you offer loyalty rewards?",
        answer:
          "Yes! Every purchase earns you loyalty points. Accumulate points and redeem them for discounts on future orders. Members also get exclusive early access to sales and special promotions.",
      },
      {
        id: "q12",
        question: "Are there seasonal promotions?",
        answer:
          "We run seasonal promotions throughout the year, especially during holidays and special occasions. Subscribe to our newsletter to stay updated on upcoming deals and exclusive member-only offers.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQ = useMemo(() => {
    return FAQ_DATA.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => {
        const matchesSearch =
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          !selectedCategory || section.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    })).filter((section) => section.questions.length > 0);
  }, [searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <FAQHero />

      {/* Main Content */}
      <motion.div
        className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-base"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="mb-10">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Filter by category:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm transition-all hover:bg-primary hover:text-primary-foreground"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Badge>
            {CATEGORIES.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className="cursor-pointer px-4 py-2 text-sm transition-all hover:bg-primary hover:text-primary-foreground"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon} {category.label}
              </Badge>
            ))}
          </div>
        </motion.div>

        <Separator className="mb-10" />

        {/* FAQ Sections */}
        {filteredFAQ.length > 0 ? (
          <motion.div variants={containerVariants} className="space-y-10">
            {filteredFAQ.map((section) => (
              <FAQAccordionSection
                key={section.category}
                questions={section.questions}
                categoryLabel={
                  CATEGORIES.find((c) => c.id === section.category)?.label || ""
                }
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="rounded-lg border border-border bg-card p-8 text-center"
          >
            <p className="text-lg text-muted-foreground">
              No questions found matching your search. Try different keywords or
              browse all categories.
            </p>
          </motion.div>
        )}

        <Separator className="my-10" />

        {/* Support CTA */}
        <SupportCTA />
      </motion.div>
    </div>
  );
}
