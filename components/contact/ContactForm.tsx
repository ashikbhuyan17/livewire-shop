'use client';

import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitContactMessage } from '@/lib/contact-forms';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('subject', formData.subject);
      payload.append('message', formData.message);

      const result = await submitContactMessage(payload);

      if (result.success) {
        toast.success(result.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col border-primary/20 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-5">
          <CardTitle className="font-sans text-xl text-primary sm:text-2xl">
            Send us a Message
          </CardTitle>
          <CardDescription className="font-sans text-sm leading-relaxed">
            Fill out the form below and we&apos;ll respond within 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="flex h-full flex-1 flex-col gap-5"
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-foreground font-medium font-sans"
              >
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                disabled={isSubmitting}
                className="border-primary/30 focus:border-primary focus:ring-primary font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-foreground font-medium font-sans"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
                className="border-primary/30 focus:border-primary focus:ring-primary font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="subject"
                className="text-foreground font-medium font-sans"
              >
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                disabled={isSubmitting}
                className="border-primary/30 focus:border-primary focus:ring-primary font-sans"
              />
            </div>

            <div className="flex min-h-0 flex-1 flex-col space-y-2">
              <Label
                htmlFor="message"
                className="text-foreground font-medium font-sans"
              >
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                required
                rows={4}
                disabled={isSubmitting}
                className="min-h-[7rem] flex-1 resize-none border-primary/30 focus:border-primary focus:ring-primary font-sans"
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-auto"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 h-auto font-sans"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ContactForm;
