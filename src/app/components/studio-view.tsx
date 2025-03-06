"use client";

import { Suspense, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	vscDarkPlus,
	vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "@/components/CopyButton";
import { ReloadButton } from "@/components/ReloadButton";
import { ShareButton } from "@/components/share-button";
import { type HistoryEntry, useStudio } from "@/providers/studio-provider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VersionSwitcher } from "./version-switcher";
import { NewButton } from "./new-button";
import { PromptInput } from "./prompt-input";
import { OptionsButton } from "./options-button";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AppLogo from "@/components/AppLogo";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import ModelSelector from "@/components/model-selector";
export default function StudioView() {
	return (
		<Suspense>
			<HomeContent />
		</Suspense>
	);
}
import { useState } from "react";

import { MODEL_OPTIONS } from "@/utils/models";

function HomeContent() {
	const searchParams = useSearchParams();
	const {
		history,
		historyIndex,
		navigateHistory,
		currentHtml,
		isOverlayOpen,
		setIsOverlayOpen,
		getFormattedOutput,
		iframeRef,
		setHistory,
		setHistoryIndex,
		setCurrentHtml,
		setMode,
		sessionId,
		setStudioMode,
		isApplying,
		isGenerating,
		isStreaming,
		streamingContent,
		streamingComplete,
		resetStreamingState,
		model,
		setModel,
	} = useStudio();
	const { resolvedTheme } = useTheme();
	const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]); // Default model
	const sourceLoadedRef = useRef(false);
	
	useEffect(() => {
		const source = searchParams.get("source");
		if (source && !sourceLoadedRef.current) {
			sourceLoadedRef.current = true;
			const loadSourceVersion = async () => {
				resetStreamingState();
				
				try {
					const response = await fetch(`/api/apps/${source}`);
					if (!response.ok) {
						throw new Error("Failed to load source version");
					}

					let html = "";
					let signature = "";
					const content = await response.text();
					if (content.startsWith("{")) {
						const json = JSON.parse(content);
						html = json.html;
						signature = json.signature;
					} else {
						html = content;
						throw new Error("This pre-release version is not supported");
					}
					const newEntry: HistoryEntry = {
						html,
						feedback: "",
						sessionId,
						version: "1",
						signature,
					};
					setHistory([newEntry]);
					setHistoryIndex(0);
					setCurrentHtml(html);
					setMode("feedback");
					setStudioMode(true);
				} catch (error) {
					console.error("Error loading source version:", error);
					toast.error("Failed to load source version");
					sourceLoadedRef.current = false; // Reset if there was an error
				}
			};
			loadSourceVersion();
		}
	}, [
		searchParams,
		sessionId,
		setCurrentHtml,
		setHistory,
		setHistoryIndex,
		setMode,
		setStudioMode,
		resetStreamingState,
		isStreaming,
		streamingContent,
		streamingComplete,
	]);

	return (
		<main className="h-screen flex flex-col overflow-hidden">
			{/* Top Input Bar */}
			<div className="p-4 bg-background lg:border-b flex-shrink-0">
				<div className="flex flex-col gap-4">
					{/* Mobile Layout */}

					<div className="flex flex-col gap-4 lg:hidden">
						{/* Top Row - Controls */}
						<div className="flex items-center justify-between gap-2 mb-1">
							<NewButton />
							<VersionSwitcher
								className="justify-center flex-1"
								currentVersion={historyIndex + 1}
								totalVersions={history.length}
								onPrevious={() => navigateHistory("prev")}
								onNext={() => navigateHistory("next")}
							/>
							<OptionsButton />
						</div>
						{/* Bottom Row - Input and Model */}
						<div className="flex flex-col gap-2">
							<div className="w-full">
								<PromptInput />
							</div>
							<div className="w-full">
								<ModelSelector
									options={MODEL_OPTIONS}
									onChange={setModel}
									initialModel={model}
								/>
							</div>
						</div>
					</div>

					{/* Desktop Layout */}
					<div className="hidden lg:flex items-center gap-4">
						<NewButton />
						<VersionSwitcher
							currentVersion={historyIndex + 1}
							totalVersions={history.length}
							onPrevious={() => navigateHistory("prev")}
							onNext={() => navigateHistory("next")}
						/>
						<div className="flex-1">
							<PromptInput />
						</div>
						<ModelSelector
							options={MODEL_OPTIONS}
							onChange={setModel}
							initialModel={model}
						/>
						<OptionsButton />
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Column - Code View or Streaming Content */}
				<div className="w-1/2 p-4 border-r overflow-auto lg:block hidden">
					<div className="relative h-full">
						<div
							className={cn(
								"absolute top-0 left-0 h-[2px] bg-groq animate-loader",
								isGenerating || isApplying ? "opacity-100" : "opacity-0",
							)}
						/>
						
						{isStreaming ? (
							// Streaming content view - match SyntaxHighlighter background
							<div 
								className="h-full rounded font-mono text-sm overflow-auto p-4"
								style={{ 
									backgroundColor: resolvedTheme === "dark" ? "#1E1E1E" : "#f5f5f5",
									color: resolvedTheme === "dark" ? "#D4D4D4" : "#000000"
								}}
							>
								<div className="flex items-center mb-4">
									<div className="h-2 w-2 rounded-full bg-groq mr-2 animate-pulse"></div>
									<span className="text-xs text-muted-foreground">
										Generating your app...
									</span>
								</div>
								<div className="whitespace-pre-wrap">
									{streamingContent || "Thinking..."}
								</div>
							</div>
						) : (
							// Code view
							<SyntaxHighlighter
								language="html"
								style={resolvedTheme === "dark" ? vscDarkPlus : vs}
								className="h-full rounded"
								customStyle={{ margin: 0, height: "100%", width: "100%" }}
							>
								{currentHtml || "<!-- HTML preview will appear here -->"}
							</SyntaxHighlighter>
						)}
						
						<div className="absolute bottom-4 left-4">
							<CopyButton code={currentHtml} />
						</div>
					</div>
				</div>

				{/* Right Column - Preview */}
				<div className="lg:w-1/2 w-full overflow-hidden">
					<div className="h-full p-4 relative">
						{/* Mobile Code View - Only shown when streaming or generating */}
						{(isStreaming || isGenerating) && (
							<div 
								className="lg:hidden block mb-4 border rounded shadow-sm p-4"
								style={{ 
									backgroundColor: resolvedTheme === "dark" ? "#1E1E1E" : "#f5f5f5",
									color: resolvedTheme === "dark" ? "#D4D4D4" : "#000000"
								}}
							>
								<div className="flex items-center mb-2">
									<div className="h-2 w-2 rounded-full bg-groq mr-2 animate-pulse"></div>
									<span className="text-xs text-muted-foreground">
										{isStreaming ? "Generating your app..." : "Processing..."}
									</span>
								</div>
								{isStreaming && (
									<div className="whitespace-pre-wrap font-mono text-xs max-h-[200px] overflow-auto">
										{streamingContent || "Thinking..."}
									</div>
								)}
							</div>
						)}
						
						<div className="absolute top-6 right-6 flex gap-2 z-10">
							<ReloadButton iframeRef={iframeRef} />
							<ShareButton
								sessionId={history[historyIndex]?.sessionId}
								version={history[historyIndex]?.version}
								signature={history[historyIndex]?.signature}
								disabled={
									!history[historyIndex]?.sessionId ||
									!history[historyIndex]?.version
								}
							/>
						</div>
						<iframe
							title="Studio Preview"
							ref={iframeRef}
							srcDoc={`<style>body{background-color:${resolvedTheme === "dark" ? "rgb(30 30 30)" : "#ffffff"};margin:0;}</style>${currentHtml}`}
							className="w-full h-full border rounded bg-background shadow-sm"
							style={{ minHeight: "100%", minWidth: "100%", overflow: "auto" }}
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
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOverlayOpen(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<X size={16} />
							</Button>
						</div>
						<pre className="flex-1 text-sm bg-background p-4 rounded overflow-auto">
							{getFormattedOutput()}
						</pre>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row w-full max-w-3xl mx-auto px-4 md:px-0">
				{/* Logo section */}
				<div className="md:w-1/2 md:pr-4 md:border-r flex items-center justify-center md:justify-end py-2">
					<span className="hidden md:inline text-sm text-muted-foreground">
						Powered by
					</span>
					<AppLogo className="scale-75" size={100} />
				</div>
				{/* Stats section */}
				<div className="md:w-1/2 md:pl-4 flex items-center justify-center md:justify-start py-2">
					<div className="text-sm text-muted-foreground text-center md:text-left">
						{history[historyIndex]?.usage && (
							<span>
								{(history[historyIndex].usage.total_time * 1000).toFixed(0)}ms •{" "}
								{Math.round(
									history[historyIndex].usage.total_tokens /
										history[historyIndex].usage.total_time,
								)}{" "}
								tokens/sec •{" "}
								<a
									rel="noreferrer"
									target="_blank"
									className="underline"
									href="https://console.groq.com/docs/models"
								>
									Build with Groq!
								</a>
							</span>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
