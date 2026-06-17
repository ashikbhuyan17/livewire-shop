import HeroSection from "@/components/contact/HeroSection";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/site";

export const metadata: Metadata = buildPageMeta({
  title: "Contact us",
  description:
    "Get in touch with BestFood City — customer support, partnerships, and store inquiries.",
  pathname: "/contact",
  keywords: ["contact BestFood City", "customer support", "grocery delivery help"],
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <div className="max-w-[95rem] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </main>
  );
}
