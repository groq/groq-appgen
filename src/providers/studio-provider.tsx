import { useState, useRef, useEffect, useCallback } from "react";
import { providerFactory } from "./provider-factory";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { constructPrompt } from "@/utils/prompt";
import { useTheme } from "next-themes";
import { EASTER_EGGS } from "@/data/easter-eggs";
import { MODEL_OPTIONS } from "@/data/models";
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
	const [feedbackHistory, setFeedbackHistory] = useState<string[]>([]);
	const [feedbackHistoryIndex, setFeedbackHistoryIndex] = useState(-1);
	const [model, setModel] = useState(MODEL_OPTIONS[0])

	const generateHtml = useCallback(async () => {
		setIsGenerating(true);
		try {
			let currentQuery = query;
			const easterEgg = EASTER_EGGS.find(
				(egg) => egg.trigger.toLowerCase() === query.trim().toLowerCase()
			);
			if (easterEgg) {
				currentQuery = easterEgg.prompt;
				setQuery(currentQuery);
			}

			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...{
						query: currentQuery,
						currentHtml,
						drawingData,
						theme: resolvedTheme,
						model: model

					},
					sessionId,
					version: history.length > 0 ? String(history.length + 1) : "1",
				}),
			});
			console.error("Error generating HTML: ",response)
			if (!response.ok) {
				throw new Error("Failed to generate HTML");
			}

			const result = await response.json();

			const newEntry: HistoryEntry = {
				html: result.html,
				feedback: "",
				usage: {
					total_time: result.usage?.total_time || 0,
					total_tokens: result.usage?.total_tokens || 0
				},
				sessionId,
				version: String(history.length + 1),
				signature: result.signature,
			};

			setHistory((prev) => [...prev, newEntry]);
			setHistoryIndex((prev) => prev + 1);
			setCurrentHtml(result.html);
			setMode("feedback");
		} catch (error) {
			console.error("Error generating HTML:", error);
			toast.error("Failed to generate HTML");
		} finally {
			setIsGenerating(false);
		}
	}, [query, currentHtml, resolvedTheme, sessionId, history, setHistory, setHistoryIndex, setCurrentHtml, setMode, setQuery, drawingData]);

	const submitFeedback = async () => {
		setIsApplying(true);
		try {
			if (currentFeedback.trim()) {
				// Add to feedback history, deduplicating entries
				setFeedbackHistory(prev => {
					const trimmedFeedback = currentFeedback.trim();
					// Remove any existing instances of this feedback
					const dedupedHistory = prev.filter(f => f !== trimmedFeedback);
					// Add the new feedback at the start
					return [trimmedFeedback, ...dedupedHistory];
				});
				setFeedbackHistoryIndex(-1);

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
	}, [triggerGeneration, setTriggerGeneration, generateHtml]);

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
		feedbackHistory,
		setFeedbackHistory,
		feedbackHistoryIndex,
		setFeedbackHistoryIndex,
		model,
		setModel
	};
});

export { StudioProvider, useStudio };
