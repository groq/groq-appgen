"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { constructPrompt } from "@/utils/prompt";
import { CopyButton } from "@/components/CopyButton";
import { ReloadButton } from "@/components/ReloadButton";
import { ShareButton } from "@/components/ShareButton";
import { ExternalButton } from "@/components/ExternalButton";
import { VersionSwitcher } from "@/components/VersionSwitcher";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useStudio } from "@/providers/studio-provider";
import { MicrophoneButton } from "@/components/MicrophoneButton";

interface HistoryEntry {
	html: string;
	feedback: string;
	usage?: {
		total_time: number;
		total_tokens: number;
	};
	sessionId?: string;
	version?: string;
}

export default function StudioView() {
	return (
		<Suspense>
			<HomeContent />
		</Suspense>
	);
}

function HomeContent() {
	const searchParams = useSearchParams();
	const { query, setQuery, triggerGeneration, setTriggerGeneration } =
		useStudio();
	const [currentHtml, setCurrentHtml] = useState("");
	const [currentFeedback, setCurrentFeedback] = useState("");
	const [isOverlayOpen, setIsOverlayOpen] = useState(false);
	const [mode, setMode] = useState<"query" | "feedback">("query");
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [sessionId] = useState(() => uuidv4());
	const [isGenerating, setIsGenerating] = useState(false);
	const [isApplying, setIsApplying] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const generateHtml = async () => {
		setIsGenerating(true);
		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query,
					currentHtml,
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

				// Save the HTML to the server
				await fetch(`/api/apps/${sessionId}/${version}`, {
					method: "POST",
					body: data.html,
				});
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
						sessionId: history[historyIndex].sessionId,
						version,
					};
					const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
					setHistory(newHistory);
					setHistoryIndex(newHistory.length - 1);
					setCurrentHtml(data.html);
					setCurrentFeedback("");

					// Save the HTML to the server
					await fetch(
						`/api/apps/${history[historyIndex].sessionId}/${version}`,
						{
							method: "POST",
							body: data.html,
						},
					);
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
		const source = searchParams.get("source");
		if (source) {
			const loadSourceVersion = async () => {
				try {
					const response = await fetch(`/api/apps/${source}`);
					if (!response.ok) {
						throw new Error("Failed to load source version");
					}
					const html = await response.text();
					const [sourceSessionId, sourceVersion] = source.split("/");
					const newEntry: HistoryEntry = {
						html,
						feedback: "",
						sessionId,
						version: "1",
					};
					setHistory([newEntry]);
					setHistoryIndex(0);
					setCurrentHtml(html);
					setMode("feedback");
				} catch (error) {
					console.error("Error loading source version:", error);
					toast.error("Failed to load source version");
				}
			};
			loadSourceVersion();
		}
	}, [searchParams]);

	useEffect(() => {
		if (triggerGeneration) {
			setTriggerGeneration(false);
			generateHtml();
		}
	}, [triggerGeneration, setTriggerGeneration]);

	return (
		<main className="h-screen flex flex-col overflow-hidden">
			{/* Top Input Bar */}
			<div className="p-4 bg-background border-b flex-shrink-0">
				<div className="flex flex-col gap-4">
					{/* Version Switcher - Separate row on mobile */}
					<VersionSwitcher
						className="lg:hidden justify-center"
						currentVersion={historyIndex + 1}
						totalVersions={history.length}
						onPrevious={() => navigateHistory("prev")}
						onNext={() => navigateHistory("next")}
					/>

					{/* Main Input Row */}
					<div className="flex items-center gap-4">
						{/* Version Switcher - Only visible on desktop */}
						<VersionSwitcher
							className="lg:flex hidden"
							currentVersion={historyIndex + 1}
							totalVersions={history.length}
							onPrevious={() => navigateHistory("prev")}
							onNext={() => navigateHistory("next")}
						/>

						<input
							type="text"
							value={mode === "query" ? query : currentFeedback}
							onChange={(e) =>
								mode === "query"
									? setQuery(e.target.value)
									: setCurrentFeedback(e.target.value)
							}
							className="flex-1 p-2 border rounded-lg"
							placeholder={
								mode === "query"
									? "Describe your app..."
									: "Enter your feedback..."
							}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									mode === "query" ? generateHtml() : submitFeedback();
								}
							}}
						/>
						<MicrophoneButton
							onTranscription={(text) =>
								mode === "query" ? setQuery(text) : setCurrentFeedback(text)
							}
						/>
						<button
							disabled={
								(mode === "query" && (!query.trim() || isGenerating)) ||
								(mode === "feedback" && isApplying)
							}
							className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B66] focus:ring-opacity-50 whitespace-nowrap transition-all duration-200 ${
								isGenerating || isApplying
									? "loading-animation"
									: "bg-[#F55036] hover:bg-[#D93D26]"
							}`}
							onClick={mode === "query" ? generateHtml : submitFeedback}
						>
							{mode === "query"
								? isGenerating
									? "Generating..."
									: "Generate"
								: isApplying
									? "Applying..."
									: "Apply edit"}
						</button>
						<button
							onClick={() => setIsOverlayOpen(!isOverlayOpen)}
							className="hidden lg:block px-4 py-2 border border-gray-300 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 whitespace-nowrap"
						>
							Show prompt
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Column - Code View */}
				<div className="w-1/2 p-4 border-r overflow-auto lg:block hidden">
					<div className="relative h-full">
						<SyntaxHighlighter
							language="html"
							style={vscDarkPlus}
							className="h-full rounded"
							customStyle={{ margin: 0, height: "100%", width: "100%" }}
						>
							{currentHtml || "<!-- HTML preview will appear here -->"}
						</SyntaxHighlighter>
						<div className="absolute bottom-4 left-4">
							<CopyButton code={currentHtml} />
						</div>
					</div>
				</div>

				{/* Right Column - Preview */}
				<div className="lg:w-1/2 w-full overflow-hidden">
					<div className="h-full p-4 relative">
						<div className="absolute top-6 right-6 flex gap-2 z-10">
							<ReloadButton iframeRef={iframeRef} />
							<ShareButton
								sessionId={history[historyIndex]?.sessionId}
								version={history[historyIndex]?.version}
								disabled={
									!history[historyIndex]?.sessionId ||
									!history[historyIndex]?.version
								}
								onShare={async () => {
									// The HTML is already saved when generated
								}}
							/>
							<ExternalButton
								sessionId={history[historyIndex]?.sessionId}
								version={history[historyIndex]?.version}
								disabled={
									!history[historyIndex]?.sessionId ||
									!history[historyIndex]?.version
								}
							/>
						</div>
						<iframe
							ref={iframeRef}
							srcDoc={currentHtml}
							className="w-full h-full border rounded bg-background shadow-sm"
							style={{ minHeight: "100%", minWidth: "100%" }}
							scrolling="no"
							sandbox="allow-scripts"
						/>
					</div>
				</div>

				{/* Sliding Debug Overlay */}
				<div
					className={`fixed top-0 right-0 h-screen w-[60vw] bg-background shadow-lg transform transition-transform duration-300 overflow-hidden z-50 ${isOverlayOpen ? "translate-x-0" : "translate-x-full"}`}
				>
					<div className="h-full flex flex-col p-4">
						<div className="flex justify-between items-center mb-4 flex-shrink-0">
							<h2 className="font-medium">Prompt</h2>
							<button
								onClick={() => setIsOverlayOpen(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								✕
							</button>
						</div>
						<pre className="flex-1 text-sm bg-background p-4 rounded overflow-auto">
							{getFormattedOutput()}
						</pre>
					</div>
				</div>
			</div>
			<div className="flex w-full max-w-3xl mx-auto">
				{/* Left column */}
				<div className="w-1/2 pr-4 pb-4 border-r">
					<div className="flex items-center justify-end text-sm text-gray-600">
						<span>Powered by</span>
						<img
							src="/groq-logo.webp"
							alt="Groq Logo"
							width={48}
							className="ml-2"
						/>
					</div>
				</div>
				{/* Right column */}
				<div className="w-1/2 pl-4 pb-4">
					<div className="flex items-center justify-start text-sm text-gray-600">
						{history[historyIndex]?.usage && (
							<span>
								{(history[historyIndex].usage.total_time * 1000).toFixed(0)}ms •{" "}
								{Math.round(
									history[historyIndex].usage.total_tokens /
										history[historyIndex].usage.total_time,
								)}{" "}
								tokens/sec •{" "}
								<a
									target="_blank"
									className="underline"
									href="https://console.groq.com/docs/models"
								>
									llama-3.3-70b-specdec
								</a>
							</span>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
