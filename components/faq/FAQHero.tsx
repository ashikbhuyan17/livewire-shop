"use client";

import { motion } from "framer-motion";

export default function FAQHero() {
  return (
    <motion.section
      className="bg-gradient-to-br from-primary/10 via-background to-accent/5 px-4 py-16 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          className="mt-4 text-balance text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Find quick answers to your grocery shopping queries. We&apos;re here
          to help!
        </motion.p>
      </div>
    </motion.section>
  );
}
