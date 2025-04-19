import { cn } from "@/lib/utils";
import React from "react";
import AugmentLogo from "./AugmentLogo";

export default function AppLogo({ className, size = 80 }: { className?: string; size?: number }) {
	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			<AugmentLogo size={size} />
		</div>
	);
}
