import HeroSection from "@/components/about/HeroSection";
import StorySection from "@/components/about/StorySection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import ValuesSection from "@/components/about/ValuesSection";
import TeamSection from "@/components/about/TeamSection";
import CTASection from "@/components/about/CTASection";
import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/site";

export const metadata: Metadata = buildPageMeta({
  title: "About us",
  description:
    "Learn about BestFood City — our story, mission, team, and how we bring quality groceries and essentials to your doorstep.",
  pathname: "/about",
  keywords: [
    "BestFood City about",
    "grocery company Bangladesh",
    "online food store",
  ],
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background mx-auto">
      <HeroSection />
      <StorySection />
      <MissionVisionSection />
      <ValuesSection />
      <TeamSection />
      <CTASection />
    </main>
  );
}
