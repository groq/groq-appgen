import { NextRequest, NextResponse } from "next/server";
import { getGallery } from "@/server/storage";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	try {
		const gallery = await getGallery();
		const searchParams = request.nextUrl.searchParams;
		const view = searchParams.get("view") || "popular";
		const now = new Date();
		
		let sortedGallery = gallery.map(item => ({
			...item,

			upvoteCount: typeof item.upvotes === 'number' ? item.upvotes : 0,
			upvotes: undefined // Remove IP addresses from response
		}));
		

		switch (view) {
			case "trending":
				// Filter for last 24 hours and sort by votes
				const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
				sortedGallery = sortedGallery
					.filter(item => new Date(item.createdAt) >= twentyFourHoursAgo)
					.sort((a, b) => b.upvoteCount - a.upvoteCount);
				break;
			
			case "new":
				// Sort by creation date (newest first)
				sortedGallery = sortedGallery
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				break;
			
			case "popular":
			default:
				// Sort by total votes
				sortedGallery = sortedGallery
					.sort((a, b) => b.upvoteCount - a.upvoteCount);
				break;
		}

		return NextResponse.json(sortedGallery);
	} catch (error) {
		console.error("Error fetching gallery:", error);
		return NextResponse.json(
			{ error: "Failed to fetch gallery" },
			{ status: 500 }
		);
	}
}
