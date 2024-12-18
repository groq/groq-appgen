import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudio } from "@/providers/studio-provider";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export function NewButton({ className }: { className?: string }) {
	const {
		setStudioMode,
		setQuery,
		setHistory,
		setHistoryIndex,
		setCurrentHtml,
		setSessionId,
		setMode,
		setCurrentFeedback,
	} = useStudio();
	return (
		<Button
			className={cn("flex items-center gap-2", className)}
			onClick={() => {
				setStudioMode(false);
				setQuery("");
				setHistory([]);
				setHistoryIndex(-1);
				setCurrentHtml("");
				setSessionId(uuidv4());
				setMode("query");
				setCurrentFeedback("");
			}}
		>
			<Plus size={16} />
			<span className="hidden lg:flex">New</span>
		</Button>
	);
}
