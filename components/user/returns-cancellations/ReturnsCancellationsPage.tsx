"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import ReturnsTable from "@/components/user/returns-cancellations/ReturnsTable";
import RequestReturnModal from "@/components/user/returns-cancellations/RequestReturnModal";
import ReturnDetailsModal from "@/components/user/returns-cancellations/ReturnDetailsModal";

export default function ReturnsAndCancellationsPage() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<unknown>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasReturns, setHasReturns] = useState(true);

  const handleViewDetails = (returnItem: unknown) => {
    setSelectedReturn(returnItem);
    setIsDetailsModalOpen(true);
  };

  const handleRequestReturn = () => {
    setIsRequestModalOpen(true);
  };

  if (!hasReturns) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-[95rem] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Returns & Cancellations
            </h1>
            <p className="text-muted-foreground">
              Manage your return and cancellation requests
            </p>
          </div>

          <Card className="border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No Returns or Cancellations Yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                You haven&apos;t made any return or cancellation requests yet.
                Browse your orders to get started.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                View My Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[95rem] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Returns & Cancellations
            </h1>
            <p className="text-muted-foreground">
              Manage your return and cancellation requests
            </p>
          </div>
          <Button
            onClick={handleRequestReturn}
            className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Request Return or Cancellation
          </Button>
        </div>

        {/* Returns Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Your Requests</CardTitle>
            <CardDescription>
              View and manage all your return and cancellation requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReturnsTable onViewDetails={handleViewDetails} />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <RequestReturnModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <ReturnDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        returnItem={selectedReturn}
      />
    </div>
  );
}
