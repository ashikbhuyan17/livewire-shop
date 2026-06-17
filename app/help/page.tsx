import SupportPage from "@/components/help/SupportPage";
import React from "react";
import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/site";

export const metadata: Metadata = buildPageMeta({
  title: "Help centre",
  description:
    "Help and support hub for BestFood City — order help, deliveries, FAQs, and how to reach us.",
  pathname: "/help",
  keywords: ["help centre", "support", "BestFood City help"],
});

function HelpPage() {
  return <SupportPage />;
}

export default HelpPage;
