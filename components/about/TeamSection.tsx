"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Sustainability advocate with 10+ years in supply chain management.",
    image:
      "https://danpite.tech/public/public/team/17599327580865Aftab%20Rishad%20PP%20Professional.jpg",
    initials: "SC",
    socials: [
      { icon: Linkedin, href: "#" },
      { icon: Twitter, href: "#" },
    ],
  },
  {
    name: "Marcus Johnson",
    role: "Co-Founder & CTO",
    bio: "Tech entrepreneur passionate about building scalable solutions.",
    image:
      "https://danpite.tech/public/public/team/17599327580865Aftab%20Rishad%20PP%20Professional.jpg",
    initials: "MJ",
    socials: [
      { icon: Github, href: "#" },
      { icon: Linkedin, href: "#" },
    ],
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Operations",
    bio: "Logistics expert dedicated to seamless delivery experiences.",
    image:
      "https://danpite.tech/public/public/team/17599327580865Aftab%20Rishad%20PP%20Professional.jpg",
    initials: "ER",
    socials: [
      { icon: Linkedin, href: "#" },
      { icon: Twitter, href: "#" },
    ],
  },
  {
    name: "David Park",
    role: "Head of Partnerships",
    bio: "Community builder connecting farmers with conscious consumers.",
    image:
      "https://danpite.tech/public/public/team/17599327580865Aftab%20Rishad%20PP%20Professional.jpg",
    initials: "DP",
    socials: [
      { icon: Linkedin, href: "#" },
      { icon: Twitter, href: "#" },
    ],
  },
];

export default function TeamSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="w-full py-20 md:py-32 px-4 md:px-8 bg-secondary/10"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate individuals dedicated to revolutionizing grocery
            shopping.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-border/50 shadow-md hover:shadow-lg  transition-all overflow-hidden group">
                <CardHeader className="p-0">
                  <div className="relative h-52 mb-4 overflow-hidden rounded-lg">
                    <Image
                      width={1200}
                      height={1200}
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex gap-3 pt-2">
                    {member.socials.map((social, idx) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={idx}
                          href={social.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label={`${member.name}'s social profile`}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
