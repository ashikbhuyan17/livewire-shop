"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

export default function StorySection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="w-full py-20 md:py-32 px-4 md:px-8 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
            className="relative h-96 md:h-full min-h-96 rounded-2xl overflow-hidden shadow-lg"
          >
            <Image
              width={1200}
              height={1200}
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
              alt="Fresh groceries and sustainable delivery"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Our Story
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                FreshCart was born from a simple observation: people wanted
                fresh, quality groceries without the hassle of crowded
                supermarkets. In 2020, our founders—a group of passionate
                entrepreneurs and sustainability advocates—decided to change the
                game.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-1 bg-primary rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    The Problem We Solve
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We recognized that busy professionals, families, and
                    health-conscious individuals needed a reliable way to access
                    fresh, organic produce without compromising on quality or
                    convenience.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-1 bg-accent rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Our Solution
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We partnered with local farmers and sustainable suppliers to
                    create a curated selection of the freshest products,
                    delivered to your door within 24 hours of harvest.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
