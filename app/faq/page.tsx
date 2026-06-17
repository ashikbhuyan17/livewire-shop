import FAQPage from "@/components/faq/FAQPage";
import React from "react";
import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/site";

export const metadata: Metadata = buildPageMeta({
  title: "FAQ",
  description:
    "Frequently asked questions about shopping, delivery, returns, and account help at BestFood City.",
  pathname: "/faq",
  keywords: ["FAQ", "help", "delivery questions", "returns"],
});

function FAQPageMain() {
  return <FAQPage />;
}

export default FAQPageMain;
