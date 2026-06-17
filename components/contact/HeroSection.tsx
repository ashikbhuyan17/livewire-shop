"use client";

import React from "react";

import { motion } from "framer-motion";

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance font-sans">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground text-balance font-sans">
            Have questions about our fresh produce or services? We&#39;d love to
            hear from you. Reach out to our team and we&apos;ll get back to you
            as soon as possible.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
