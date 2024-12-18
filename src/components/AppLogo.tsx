import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function AppLogo({ className }: { className?: string }) {
	const { resolvedTheme } = useTheme();
	const logoSrc = resolvedTheme === "dark" ? "/groq-logo-white.webp" : "/groq-logo.webp";

	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			<Image key={resolvedTheme} src={logoSrc} alt="Groq" width={60} height={20} />
		</div>
	);
}
