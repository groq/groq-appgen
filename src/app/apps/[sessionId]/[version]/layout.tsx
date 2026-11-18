import { getFromStorageWithRegex, getStorageKey } from "@/server/storage";
import type { Metadata } from "next";
import { ROOT_URL } from "@/utils/config";
import { headers } from "next/headers";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{
		sessionId: string;
		version: string;
	}>;
}

export async function generateMetadata({
	params,
}: LayoutProps): Promise<Metadata> {
	const { sessionId, version } = await params;

	try {
		const headersList = headers();
		const key = getStorageKey(sessionId, version);
		const { value:res } = await getFromStorageWithRegex(key);
		
		if (!res) {
			return {};
		}

		const data = JSON.parse(res);
		if (data) {
			return {
				title: data.title,
				description: data.description,
				openGraph: {
					title: data.title,
					description: data.description,
					images: `https://image.thum.io/get/${ROOT_URL}/api/apps/${sessionId}/${version}/raw`,
					type: "website",
				},
			};
		}
	} catch (error) {
		console.error("Error generating metadata:", error);
	}

	return {};
}

export default function Layout({ children }: LayoutProps) {
	return <>{children}</>;
}
