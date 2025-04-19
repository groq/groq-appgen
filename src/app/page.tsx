"use client";

import { StudioProvider } from "@/providers/studio-provider";
import MainView from "./components/main-view";
import { SplashScreenWrapper } from "./components/splash-screen-wrapper";

export default function Home() {
	return (
		<StudioProvider>
			<SplashScreenWrapper>
				<MainView />
			</SplashScreenWrapper>
		</StudioProvider>
	);
}
