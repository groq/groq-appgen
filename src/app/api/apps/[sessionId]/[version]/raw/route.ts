import { NextRequest, NextResponse } from "next/server";
import { getFromStorageWithRegex, getStorageKey } from "@/server/storage";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ sessionId: string; version: string }> }
) {
	const { sessionId, version } = await params;

	try {
		const key = getStorageKey(sessionId, version);
		const {value} = await getFromStorageWithRegex(key);

		if (!value) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const data = JSON.parse(value);
		return new NextResponse(data.html, {
			headers: {
				"Content-Type": "text/html",
			},
		});
	} catch (error) {
		console.error("Error retrieving raw app:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve app" },
			{ status: 500 }
		);
	}
}
