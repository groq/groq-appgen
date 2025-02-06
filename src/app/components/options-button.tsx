import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useStudio } from "@/providers/studio-provider";
import { Ellipsis } from "lucide-react";

export function OptionsButton({ className }: { className?: string }) {
	const { setIsOverlayOpen, isOverlayOpen } = useStudio();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{/* Mobile view - just the icon */}
				<button className={cn("lg:hidden text-foreground px-2", className)}>
					<Ellipsis size={20} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => setIsOverlayOpen(!isOverlayOpen)}>
					Show prompt
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
