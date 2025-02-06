import { Button } from "@/components/ui/button";
import { useStudio } from "@/providers/studio-provider";
import { SendHorizontal, Wand2 } from "lucide-react";

export function SubmitButton() {
	const {
		mode,
		query,
		isGenerating,
		isApplying,
		generateHtml,
		submitFeedback,
	} = useStudio();
	return (
		<Button
			disabled={
				(mode === "query" && (!query.trim() || isGenerating)) ||
				(mode === "feedback" && isApplying)
			}
			size="default"
			className={`bg-groq text-groq-foreground transition-all duration-200 rounded-full lg:px-4 lg:h-10 lg:w-auto w-10 h-10 ${
				isGenerating || isApplying
					? "loading-animation"
					: "bg-[#F55036] hover:bg-[#D93D26]"
			}`}
			onClick={mode === "query" ? generateHtml : submitFeedback}
		>
			<span className="hidden lg:inline">
				{mode === "query"
					? isGenerating
						? "Generating..."
						: "Generate"
					: isApplying
						? "Applying..."
						: "Apply Edit"}
			</span>
			<span className="lg:hidden">
				{mode === "query" ? (
					<Wand2 className="h-4 w-4" />
				) : (
					<SendHorizontal className="h-4 w-4" />
				)}
			</span>
		</Button>
	);
}
