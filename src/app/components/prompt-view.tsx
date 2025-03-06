import AppLogo from "@/components/AppLogo";
import { MicrophoneButton } from "@/components/MicrophoneButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudio } from "@/providers/studio-provider";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { useState } from "react";
import { APP_EXAMPLES } from "@/data/app-examples";
import { Info, Pencil } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ModelSelector from "@/components/model-selector";
import Groq_bolt from "public/groq_bolt.svg"
import { GalleryListing } from "./gallery-listing";
import { MAINTENANCE_GENERATION } from "@/lib/settings";
import { MODEL_OPTIONS } from "@/utils/models";
const APP_SUGGESTIONS = APP_EXAMPLES.map((example) => example.label);


export default function PromptView() {
	const {
		setStudioMode,
		query,
		setQuery,
		setTriggerGeneration,
		drawingData,
		setDrawingData,
		model,
		setModel,
		resetStreamingState,
	} = useStudio();
	const [showDrawing, setShowDrawing] = useState(false);
	const [selectedModel, setSelectedModel] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("selectedModel") || MODEL_OPTIONS[0];
		}
		return MODEL_OPTIONS[0];
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim() && !drawingData) {
			toast.error("Describe your app or draw it!");
			return;
		}
		resetStreamingState();
		
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	const handleDrawingComplete = async (imageData: string) => {
		setDrawingData(imageData);
		setShowDrawing(false);
	};

	const handleSuggestionClick = (suggestion: string) => () => {
		const example = APP_EXAMPLES.find((ex) => ex.label === suggestion);
		setQuery(example?.prompt || suggestion);
		
		resetStreamingState();
		
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	const handleTranscription = (transcription: string) => {
		setQuery(transcription);
		
		resetStreamingState();
		
		setStudioMode(true);
		setTriggerGeneration(true);
	};



	return (
		<div className="flex flex-col gap-6 items-center justify-center">
			<AppLogo className="self-start mt-10 ml-10" size={120} />
			<div className="flex flex-col gap-3 items-center justify-center min-w-[50%] px-4 md:px-0 mt-10">
			<div>
					<h1 className="text-[2em] md:text-[3em] font-montserrat text-center">
						Build a micro-app
					</h1>
					<h2 className="text-[1.2em] md:text-[1.4em] font-montserrat mb-4 md:mb-8 text-center text-muted-foreground flex items-center justify-center gap-2">
					at Groq speed
						<img src="/Groq_Bolt.svg" alt="Groq Logo" className="w-8 h-8" />
					</h2>
				</div>
				{MAINTENANCE_GENERATION && (
					<div className="text-center text-gray-500 flex items-center gap-2 border border-groq rounded-full p-4 my-4">
						<Info className="h-5 w-5" />
						{"We're currently undergoing maintenance. We'll be back soon!"}
					</div>
				)}
				<form
					className="flex flex-col relative border-2 border-border border-solid rounded-lg p-4 w-full max-w-2xl focus-within:border-groq dark:border-[#666666]"
					onSubmit={handleSubmit}
				>
					<textarea
						disabled={MAINTENANCE_GENERATION}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full h-16 p-3 text-sm bg-transparent focus:outline-none resize-none"
						placeholder="Describe your app..."
					/>
						<div className="flex justify-between items-center w-full mt-4">
						<div className="flex items-center gap-2">
						<Button
							disabled={MAINTENANCE_GENERATION}
							type="button"
							variant="ghost"
							size="icon"
							className={`rounded-full shrink-0 flex items-center justify-center px-3 ${
								drawingData ? "min-w-[80px]" : "min-w-[40px]"
							}`}
							onClick={() => setShowDrawing(true)}
						>
							{drawingData ? (
								<div className="flex items-center gap-1.5">
									<Pencil className="h-4 w-4" />
									<span className="text-sm">Edit</span>
								</div>
							) : (
								<Pencil className="h-5 w-5" />
							)}
						</Button>
						<MicrophoneButton
							onTranscription={handleTranscription}
							disabled={MAINTENANCE_GENERATION}
						/>
						</div>
						<div className="flex items-center gap-2 ml-auto">
						<ModelSelector
						onChange={(model) => {
							setSelectedModel(model);
							setModel(model); // This will update both local and global states
						}}
						initialModel={model}
						/>
						<Button
							className="rounded-full"
							type="submit"
							disabled={MAINTENANCE_GENERATION}
						>
							Create
						</Button>
						</div>
					</div>
				</form>
			</div>
			{showDrawing && (
				<DrawingCanvas
					onDrawingComplete={handleDrawingComplete}
					onClose={() => setShowDrawing(false)}
				/>
			)}
			<div className="flex flex-wrap justify-center gap-3 items-center w-[90%] md:w-[60%] lg:w-[50%] pb-4 px-2">
				{APP_SUGGESTIONS.map((suggestion) => (
					<Button
						disabled={MAINTENANCE_GENERATION}
						key={suggestion}
						variant="outline"
						className="rounded-full text-xs whitespace-nowrap shrink-0"
						onClick={handleSuggestionClick(suggestion)}
					>
						{suggestion}
					</Button>
				))}
			</div>
			<div className="w-full px-4 mb-[100px]">
				<Link href="/gallery">
					<h2 className="font-montserrat text-2xl mt-20 mb-10 text-center">
						Gallery
					</h2>
				</Link>
				<div className="max-w-[1200px] mx-auto">
					<GalleryListing limit={10} view="trending" />
				</div>
				<div className="w-full flex justify-center mt-10">
					<Link
						href="/gallery"
						className="w-full text-sm text-muted-foreground text-center"
					>
						View all
					</Link>
				</div>
			</div>
		</div>
	);
}