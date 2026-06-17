"use client";

import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import StatusAlert from "./StatusAlert";
import FAQSection from "./FAQSection";
import ContactSection from "./ContactSection";
import SupportHours from "./SupportHours";

function SupportPage() {
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

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <StatusAlert />
      <HeroSection />

      <div className="mx-auto max-w-[95rem] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* FAQ Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <FAQSection />
          </div>

          {/* Sidebar with Contact and Hours */}
          <div className="space-y-6">
            <ContactSection />
            <SupportHours />
          </div>
        </div>
      </div>
    </motion.main>
  );
}

export default SupportPage;
