"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Heart, Sprout, Users } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Quality",
    description:
      "We source only the freshest, highest-quality produce from trusted local farmers and sustainable suppliers.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Heart,
    title: "Trust",
    description:
      "Transparency and reliability are at the heart of everything we do. We stand behind every product we deliver.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Sprout,
    title: "Sustainability",
    description:
      "We are committed to reducing our environmental footprint through eco-friendly packaging and carbon-neutral delivery.",
    color: "text-green-600",
    bgColor: "bg-green-600/10",
  },
  {
    icon: Users,
    title: "Customer Happiness",
    description:
      "Your satisfaction is our priority. We listen, adapt, and continuously improve to exceed your expectations.",
    color: "text-green-600",
    bgColor: "bg-green-600/10",
  },
];

export default function ValuesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      ref={ref}
      className="w-full py-20 md:py-32 px-4 md:px-8 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Our Core Values
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These principles guide every decision we make and every interaction
            we have.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-border/50 shadow-md hover:shadow-lg transition-all hover:border-primary/30">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${value.bgColor} flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-6 h-6 ${value.color}`} />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
