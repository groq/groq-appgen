"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROOT_URL } from "@/utils/config";

export default function BlockPage({
  searchParams,
}: {
  searchParams: Promise<{ ip: string; token: string }>;
}) {
  const handleBlock = async () => {
    try {
      const { ip, token } = await searchParams;
      const response = await fetch(
        `${ROOT_URL}/api/block?ip=${encodeURIComponent(
          ip
        )}&token=${encodeURIComponent(token)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to block IP");
      }

      // Redirect to home page after successful block
      window.location.href = ROOT_URL;
    } catch (error) {
      console.error("Error blocking IP:", error);
      alert("Failed to block IP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Confirm Block Action</h1>
        <p className="text-center text-muted-foreground">
          Are you sure you want to block this IP address? This action cannot be
          undone.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            variant="destructive"
            onClick={handleBlock}
          >
            Confirm Block
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
