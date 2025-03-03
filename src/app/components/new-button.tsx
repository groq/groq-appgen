import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudio } from "@/providers/studio-provider";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
		resetStreamingState,
	} = useStudio();
	const router = useRouter();

	const handleClick = () => {
		setStudioMode(false);
		setQuery("");
		setHistory([]);
		setHistoryIndex(-1);
		setCurrentHtml("");
		setSessionId(uuidv4());
		setMode("query");
		setCurrentFeedback("");
		resetStreamingState();
		router.push("/");
	};

	return (
		<>
			{/* Mobile view - just the icon */}
			<button
				onClick={handleClick}
				className={cn("lg:hidden text-foreground px-2", className)}
			>
				<Plus size={20} />
			</button>

			{/* Desktop view - full button */}
			<Button
				className={cn("hidden lg:flex items-center gap-2", className)}
				onClick={handleClick}
			>
				<Plus size={16} />
				<span>New</span>
			</Button>
		</>
	);
}
