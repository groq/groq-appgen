import { useState, useRef, useEffect } from "react";
import { providerFactory } from "./provider-factory";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { constructPrompt } from "@/utils/prompt";
import { useTheme } from "next-themes";
import { EASTER_EGG_PROMPT } from "@/data/app-examples";

export interface HistoryEntry {
	html: string;
	feedback: string;
	usage?: {
		total_time: number;
		total_tokens: number;
	};
	signature?: string;
	sessionId?: string;
	version?: string;
}

const [StudioProvider, useStudio] = providerFactory(() => {
	const [query, setQuery] = useState("");
	const [studioMode, setStudioMode] = useState(false);
	const [triggerGeneration, setTriggerGeneration] = useState(false);
	const [currentHtml, setCurrentHtml] = useState("");
	const [currentFeedback, setCurrentFeedback] = useState("");
	const [isOverlayOpen, setIsOverlayOpen] = useState(false);
	const [mode, setMode] = useState<"query" | "feedback">("query");
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [sessionId, setSessionId] = useState(() => uuidv4());
	const [isGenerating, setIsGenerating] = useState(false);
	const [isApplying, setIsApplying] = useState(false);
	const [drawingData, setDrawingData] = useState<string | null>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const { resolvedTheme } = useTheme();

	const generateHtml = async () => {
		setIsGenerating(true);
		try {
			let currentQuery = query;
			if (query.trim().toLowerCase() === "groq race") {
				currentQuery = EASTER_EGG_PROMPT;
				setQuery(currentQuery);
			}

			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: currentQuery,
					currentHtml,
					theme: resolvedTheme,
					drawingData,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				if (response.status === 400 && data.category) {
					toast.error(
						<div>
							<p>{data.error}</p>
							<p className="text-sm text-gray-500 mt-1">
								Category: {data.category}
							</p>
						</div>,
						{ duration: 5000 },
					);
					return;
				}
				throw new Error("Failed to generate HTML");
			}

			if (data.html) {
				const version = (history.length + 1).toString();
				const newEntry: HistoryEntry = {
					html: data.html,
					signature: data.signature,
					feedback: "",
					usage: data.usage,
					sessionId,
					version,
				};
				const newHistory =
					historyIndex === -1
						? [newEntry]
						: [...history.slice(0, historyIndex + 1), newEntry];
				setHistory(newHistory);
				setHistoryIndex(newHistory.length - 1);
				setCurrentHtml(data.html);
				setMode("feedback");
				setDrawingData(null); // Clear drawing data after successful generation
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error("Failed to generate HTML");
		} finally {
			setIsGenerating(false);
		}
	};

	const submitFeedback = async () => {
		setIsApplying(true);
		try {
			if (currentFeedback.trim()) {
				// Update history entry with new feedback
				const updatedHistory = [...history];
				updatedHistory[historyIndex] = {
					...updatedHistory[historyIndex],
					feedback: currentFeedback.trim(),
				};
				setHistory(updatedHistory);

				const response = await fetch("/api/generate", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						currentHtml: history[historyIndex].html,
						feedback: currentFeedback.trim(),
						theme: resolvedTheme,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					if (response.status === 400 && data.category) {
						toast.error(
							<div>
								<p>{data.error}</p>
								<p className="text-sm text-gray-500 mt-1">
									Category: {data.category}
								</p>
							</div>,
							{ duration: 5000 },
						);
						return;
					}
					throw new Error("Failed to generate HTML");
				}

				if (data.html) {
					const version = (history.length + 1).toString();
					const newEntry: HistoryEntry = {
						html: data.html,
						feedback: "",
						usage: data.usage,
						signature: data.signature,
						sessionId: history[historyIndex].sessionId,
						version,
					};
					const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
					setHistory(newHistory);
					setHistoryIndex(newHistory.length - 1);
					setCurrentHtml(data.html);
					setCurrentFeedback("");
				}
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error("Failed to apply edit");
		} finally {
			setIsApplying(false);
		}
	};

	const navigateHistory = (direction: "prev" | "next") => {
		const newIndex = direction === "prev" ? historyIndex - 1 : historyIndex + 1;
		if (newIndex >= 0 && newIndex < history.length) {
			setHistoryIndex(newIndex);
			setCurrentHtml(history[newIndex].html);
			setCurrentFeedback(history[newIndex].feedback || "");
		}
	};

	const getFormattedOutput = () => {
		return constructPrompt({
			query,
			currentFeedback,
			currentHtml,
			theme: resolvedTheme,
		});
	};

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsOverlayOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, []);

	useEffect(() => {
		if (triggerGeneration) {
			setTriggerGeneration(false);
			generateHtml();
		}
	}, [triggerGeneration, setTriggerGeneration]);

	return {
		query,
		setQuery,
		studioMode,
		setStudioMode,
		triggerGeneration,
		setTriggerGeneration,
		history,
		setHistory,
		historyIndex,
		setHistoryIndex,
		navigateHistory,
		mode,
		setMode,
		currentHtml,
		setCurrentHtml,
		currentFeedback,
		setCurrentFeedback,
		isOverlayOpen,
		setIsOverlayOpen,
		isGenerating,
		setIsGenerating,
		isApplying,
		setIsApplying,
		generateHtml,
		submitFeedback,
		getFormattedOutput,
		iframeRef,
		sessionId,
		setSessionId,
		drawingData,
		setDrawingData,
	};
});

export { StudioProvider, useStudio };
