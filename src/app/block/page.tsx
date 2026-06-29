"use client";

import { Card } from "@/components/ui/card";

export default function BlockPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Moderation Review</h1>
        <p className="text-center text-muted-foreground">
          Blocking now requires an internal server-side action.
        </p>
      </Card>
    </div>
  );
}
