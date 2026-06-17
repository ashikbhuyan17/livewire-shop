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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export default function DangerZone() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteInputValue, setDeleteInputValue] = useState("");

  const handleDeleteAccount = () => {
    alert(
      "Account deletion initiated. Please check your email for confirmation."
    );
    setIsOpen(false);
  };

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Irreversible actions that require careful consideration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deleting your account is permanent and cannot be undone. All your
            data, orders, and preferences will be permanently removed from our
            system.
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Delete My Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Account
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Please read carefully before
                  proceeding.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">
                    ⚠️ Warning: Deleting your account will:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-destructive/80">
                    <li>• Permanently delete all your personal information</li>
                    <li>• Remove all saved addresses and payment methods</li>
                    <li>• Cancel any active subscriptions or orders</li>
                    <li>• Delete your order history</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Type &quot;DELETE&quot; to confirm account deletion:
                  </p>
                  <input
                    value={deleteInputValue}
                    onChange={(e) => setDeleteInputValue(e.target.value)}
                    type="text"
                    placeholder="Type DELETE to confirm"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={deleteInputValue !== "DELETE"}
                    variant="destructive"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
