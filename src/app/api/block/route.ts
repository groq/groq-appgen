import { NextRequest, NextResponse } from "next/server";
import { blockIP } from "@/server/storage";

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("x-block-secret");
        const { ip } = await request.json() as { ip?: string };

        if (!ip || !token) {
            return new NextResponse("Missing ip or block secret", { status: 400 });
        }

        await blockIP(ip, token);
        
        return new NextResponse(JSON.stringify({ success: true }), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return new NextResponse("Invalid request body", { status: 400 });
        }
        if (error instanceof Error && error.message === "Invalid token") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        console.error("Error blocking IP:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
