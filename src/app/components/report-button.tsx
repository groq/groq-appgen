"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface ReportButtonProps {
	sessionId: string;
	version: string;
}

export function ReportButton({ sessionId, version }: ReportButtonProps) {
	const [isReported, setIsReported] = useState(false);

	const reportApp = async () => {
		try {
			const response = await fetch("/api/report", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					sessionId,
					appUrl: `${window.location.origin}/apps/${sessionId}/${version}`,
					version,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to report app");
			}

			setIsReported(true);
			toast.success("App reported successfully");
		} catch (error) {
			console.error("Error reporting app:", error);
			toast.error(error instanceof Error ? error.message : "Failed to report app");
		}
	};

	return (
		<Button
			variant="destructive"
			onClick={reportApp}
			disabled={isReported}
			className="flex items-center gap-2"
		>
			<AlertCircle size={16} />
			{isReported ? "Reported" : "Report"}
		</Button>
	);
}
