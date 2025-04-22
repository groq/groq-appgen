import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ROOT_URL } from "@/utils/config";
import { MAINTENANCE_MODE } from "@/lib/settings";
import { LayoutClientContent } from '@/components/layout-client-content';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Groq Appgen",
	description: "Interactive HTML editor with AI generation",

	icons: {
		icon: "/icons/icon.png",
	},

	openGraph: {
		type: "website",
		url: ROOT_URL,
		title: "Groq Appgen",
		description: "Interactive HTML editor with AI generation",
		images: `${ROOT_URL}/og-labs.png`,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<LayoutClientContent>
						{MAINTENANCE_MODE ? (
							<div className="text-center text-gray-500 py-8">
								{"We're currently undergoing maintenance. We'll be back soon!"}
							</div>
						) : (
							<>
								{children}
								<Toaster position="bottom-right" />
							</>
						)}
					</LayoutClientContent>

					<footer className="fixed bottom-0 left-0 w-fit text-left text-sm py-1 px-4 bg-[hsl(var(--background))] border-t border-l border-r border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] z-10 rounded-tr-sm">
						<a href="https://groq.com/terms-of-use/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[hsl(var(--foreground))] mx-2">
							Terms of Service
						</a>
						|
						<a href="https://groq.com/wp-content/uploads/2024/05/Groq-Privacy-Policy_Final_30MAY2024.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-[hsl(var(--foreground))] mx-2">
							Privacy Policy
						</a>
					</footer>

				</ThemeProvider>
			</body>
		</html>
	);
}
