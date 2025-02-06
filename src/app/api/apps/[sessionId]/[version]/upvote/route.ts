import { NextRequest, NextResponse } from "next/server";
import { upvoteGalleryItem, getUpvotes } from "@/server/storage";

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string; version: string } }
) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || request.ip || "unknown";
    const timestamp = new Date().toISOString();
    const upvoteCount = await upvoteGalleryItem(params.sessionId, params.version, clientIp, timestamp);
    return NextResponse.json({ upvotes: upvoteCount });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upvote" },
      { status: 400 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { sessionId: string; version: string } }
) {
  try {
    const upvoteCount = await getUpvotes(params.sessionId, params.version);
    return NextResponse.json({ upvotes: upvoteCount });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get upvotes" },
      { status: 400 }
    );
  }
}