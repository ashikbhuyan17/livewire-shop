import ReturnsAndCancellationsPage from "@/components/user/returns-cancellations/ReturnsCancellationsPage";
import React from "react";
import type { Metadata } from "next";
import { buildPageMeta, PRIVATE_ROUTE_ROBOTS } from "@/lib/site";

export const metadata: Metadata = buildPageMeta({
  title: "Returns & cancellations",
  description:
    "Request returns or manage cancellations for purchases at BestFood City.",
  pathname: "/user/returns-cancellations",
  robots: PRIVATE_ROUTE_ROBOTS,
});

function UserReturnsCancellations() {
  return <ReturnsAndCancellationsPage />;
}

export default UserReturnsCancellations;
