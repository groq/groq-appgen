import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ROOT_URL } from "@/utils/config";
// ModeToggle removido
import { GoogleAnalytics } from "@next/third-parties/google";
import { MAINTENANCE_MODE } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Nexus Gen",
	description: "Interactive HTML editor with AI generation",

	icons: {
		icon: "/icons/icon.png",
	},

	openGraph: {
		type: "website",
		url: ROOT_URL,
		title: "Nexus Gen",
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
				</ThemeProvider>
				<GoogleAnalytics gaId="G-MGQ7E93R12" />
			</body>
		</html>
	);
}
