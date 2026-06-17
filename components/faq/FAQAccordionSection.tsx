"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionSectionProps {
  categoryLabel: string;
  questions: Question[];
}

export default function FAQAccordionSection({
  categoryLabel,
  questions,
}: FAQAccordionSectionProps) {
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
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div variants={itemVariants}>
      <h2 className="mb-6 text-2xl font-semibold text-foreground">
        {categoryLabel}
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Accordion type="single" collapsible className="space-y-3">
          {questions.map((q) => (
            <motion.div key={q.id} variants={itemVariants}>
              <AccordionItem
                value={q.id}
                className="rounded-lg border border-border bg-card px-6 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <AccordionTrigger className="py-4 text-left font-medium text-foreground hover:text-primary">
                  {q.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2 text-muted-foreground">
                  {q.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </motion.div>
  );
}
