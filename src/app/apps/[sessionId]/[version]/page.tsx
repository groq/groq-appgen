"use client";

import { useEffect, useState } from "react";
import { RemixButton } from "@/components/RemixButton";
import { Button } from "@/components/ui/button";
import { ReportButton } from "@/app/components/report-button";
import { UpvoteButton } from "@/app/components/upvote-button";
import { RemoveButton } from "@/app/components/remove-button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface AppData {
	html: string;
	avoidGallery?: boolean;
}

export default function SharedApp({
	params,
}: {
	params: { sessionId: string; version: string };
}) {
	const [html, setHtml] = useState("");
	const [showWarning, setShowWarning] = useState(true);
	const [isInGallery, setIsInGallery] = useState<boolean>(true);

	useEffect(() => {
		const fetchHtml = async () => {
			try {
				const response = await fetch(
					`/api/apps/${params.sessionId}/${params.version}`,
				);
				if (!response.ok) {
					throw new Error("Failed to fetch HTML");
				}
				const content = await response.text();
				if (content.startsWith("{")) {
					const data: AppData = JSON.parse(content);
					setHtml(data.html);
					setIsInGallery(!data.avoidGallery);
				} else {
					setHtml(content);
				}
			} catch (error) {
				console.error("Error fetching HTML:", error);
			}
		};

		if (!showWarning) {
			fetchHtml();
		}
	}, [params.sessionId, params.version, showWarning]);

	return (
		<div className="w-screen h-screen relative">
			<Dialog open={showWarning} onOpenChange={setShowWarning}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Warning</DialogTitle>
						<DialogDescription>
							This is user generated content. Groq is not responsible for the content.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setShowWarning(false)}>
							Continue
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{!showWarning && (
				<>
					<iframe
						title="Shared App"
						srcDoc={html}
						className="w-full h-full border-0"
						style={{ height: "100vh" }}
					/>
					<div className="absolute bottom-4 right-4 flex gap-2 z-10">
						<ReportButton
							sessionId={params.sessionId}
							version={params.version}
						/>
						<RemoveButton
							sessionId={params.sessionId}
							version={params.version}
						/>
						<RemixButton
							sessionId={params.sessionId}
							version={params.version}
						/>
						{isInGallery && (
							<UpvoteButton
								sessionId={params.sessionId}
								version={params.version}
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
}
