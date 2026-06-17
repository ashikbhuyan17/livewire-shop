"use client";

import { motion, easeInOut } from "framer-motion";

export default function HeroSection() {
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeInOut },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2, ease: easeInOut },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 px-4 py-20 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.h1
          className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          We&apos;re Here to Help
        </motion.h1>

        <motion.p
          className="mt-6 text-balance text-lg text-muted-foreground sm:text-xl"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Get answers to your questions and connect with our support team.
          We&apos;re committed to making your grocery shopping experience smooth
          and enjoyable.
        </motion.p>
      </div>
    </section>
  );
}
