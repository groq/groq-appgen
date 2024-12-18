import { Input } from "@/components/ui/input";
import { useStudio } from "@/providers/studio-provider";
import { SubmitButton } from "./submit-button";
import { MicrophoneButton } from "@/components/MicrophoneButton";
import { useEffect, useRef } from "react";

export function PromptInput() {
	const {
		mode,
		query,
		currentFeedback,
		setQuery,
		setCurrentFeedback,
		generateHtml,
		submitFeedback,
	} = useStudio();

	const shouldTriggerRef = useRef(false);

	useEffect(() => {
		if (shouldTriggerRef.current) {
			if (mode === "query") {
				generateHtml();
			} else {
				submitFeedback();
			}
			shouldTriggerRef.current = false;
		}
	}, [query, currentFeedback, mode, generateHtml, submitFeedback]);

	const handleTranscription = (transcription: string) => {
		shouldTriggerRef.current = true;
		if (mode === "query") {
			setQuery(transcription);
		} else {
			setCurrentFeedback(transcription);
		}
	};

	return (
		<div className="flex items-center gap-2 flex-1 border-border border focus-within:border-groq rounded-full p-1">
			<Input
				autoFocus
				type="text"
				value={mode === "query" ? query : currentFeedback}
				onChange={(e) =>
					mode === "query"
						? setQuery(e.target.value)
						: setCurrentFeedback(e.target.value)
				}
				className="flex-1 p-2 border-0 rounded focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
				placeholder={
					mode === "query" ? "Describe your app..." : "Enter your feedback..."
				}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						mode === "query" ? generateHtml() : submitFeedback();
					}
				}}
			/>
			<MicrophoneButton onTranscription={handleTranscription} />
			<SubmitButton />
		</div>
	);
}
