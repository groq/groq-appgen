import { NextRequest, NextResponse } from "next/server";
import { removeGalleryItem } from "@/server/storage";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string; version: string }> }
) {
    const { sessionId, version } = await params;
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    try {
        const removed = await removeGalleryItem(sessionId, version, ip);
        if (removed) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: "Item not found" },
                { status: 404 }
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("Unauthorized")) {
                return NextResponse.json(
                    { error: "You can only remove your own submissions" },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: "Failed to remove item" },
            { status: 500 }
        );
    }
}
