import { NextRequest, NextResponse } from "next/server";
import { getFromStorageWithRegex, saveToStorage, getStorageKey, addToGallery, isIPBlocked } from "@/server/storage";
import { renderSandboxedHtml } from "@/server/sandboxed-html";
import { verifyHtml } from "@/server/signing";

export async function GET(
	request: NextRequest,
	{ params }: { params: { sessionId: string; version: string } },
) {
	const { sessionId, version } = params;
	const raw = request.nextUrl.searchParams.get("raw") === "true";

	try {
		const key = getStorageKey(sessionId, version);
		const { value } = await getFromStorageWithRegex(key);

		if (!value) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const data = JSON.parse(value);
		if (raw) {
			return renderSandboxedHtml(data.html);
		}
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error retrieving app:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve app" },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { sessionId: string; version: string } },
) {
	const { sessionId, version } = params;

	try {
		const { html, signature, avoidGallery, ...rest } = await request.json();
		const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

		if (await isIPBlocked(ip)) {
			console.warn(`Someone tried to submit from a blocked IP: ${ip}`);
			return NextResponse.json(
				{ error: "IP address is blocked" },
				{ status: 403 }
			);
		}

		const key = getStorageKey(sessionId, version, ip);

		if (!verifyHtml(html, signature)) {
			return NextResponse.json(
				{ error: "Invalid signature" },
				{ status: 400 }
			);
		}

		// Add creatorIP to the stored data
		const data = {
			html,
			signature,
			...rest,
			avoidGallery,
			creatorIP: ip,
			createdAt: new Date().toISOString(),
		};

		await saveToStorage(key, JSON.stringify(data));

		if (!avoidGallery) {
			let success = await addToGallery({ 
				sessionId, 
				version, 
				signature,
				...rest,
			}, ip);
			if(!success) {
				return NextResponse.json(
					{ error: "Failed to save app" },
					{ status: 500 }
				);
			}
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving app:", error);
		return NextResponse.json(
			{ error: "Failed to save app" },
			{ status: 500 }
		);
	}
}
