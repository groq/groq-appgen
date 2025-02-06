import { ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export function UpvoteButton({
  sessionId,
  version,
  initialUpvotes = -1,
}: {
  sessionId: string;
  version: string;
  initialUpvotes?: number;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isLoading, setIsLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchUpvotes = async () => {
      try {
        const response = await fetch(`/api/apps/${sessionId}/${version}/upvote`, {
          method: "GET",
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch upvotes");
        }
        
        const data = await response.json();
        setUpvotes(data.upvotes);
      } catch (error) {
        console.error("Failed to fetch upvotes:", error);
      }
    };

    fetchUpvotes();
  }, [sessionId, version]);

  const handleUpvote = async () => {
    if (hasVoted) {
      toast.error("You've already voted for this app!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/apps/${sessionId}/${version}/upvote`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (data.error === "Already voted") {
          setHasVoted(true);
          throw new Error("You've already voted for this app!");
        }
        throw new Error(data.error || "Failed to upvote");
      }
      
      const data = await response.json();
      setUpvotes(data.upvotes);
      setHasVoted(true);
      toast.success("Thanks for your vote!", {
        duration: 3000,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upvote. Please try again later", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex gap-2 px-3"
      onClick={handleUpvote}
      disabled={isLoading || hasVoted}
    >
      {upvotes === -1 ? (
        <span className="animate-pulse">Loading...</span>
      ) : (
        <>
          <ThumbsUp className={hasVoted ? "text-blue-500" : ""} /> {upvotes}
        </>
      )}
    </Button>
  );
}
