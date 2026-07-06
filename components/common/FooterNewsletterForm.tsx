'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { subscribeNewsletter } from '@/lib/contact-forms';

export default function FooterNewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await subscribeNewsletter(formData);

      if (result.success) {
        toast.success(result.message);
        event.currentTarget.reset();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full max-w-lg sm:max-w-xl" onSubmit={handleSubmit}>
      <div className="flex h-12 items-center gap-1 overflow-hidden rounded-full bg-white p-1.5 pl-4 shadow-[0_6px_24px_rgba(2,80,162,0.14)] ring-1 ring-primary/15 sm:h-[3.25rem] sm:pl-5">
        <Input
          type="email"
          name="email"
          placeholder="Your email address"
          required
          disabled={isSubmitting}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-base"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-9 shrink-0 gap-1.5 rounded-full bg-primary px-4 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-primary/90 sm:h-10 sm:px-5 sm:text-sm"
        >
          {isSubmitting ? 'Sending...' : 'Subscribe'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
