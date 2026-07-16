import { NextResponse } from "next/server";

export const SANDBOXED_HTML_CSP =
	"sandbox allow-scripts allow-forms allow-popups allow-modals allow-downloads";

export function renderSandboxedHtml(html: string) {
	return new NextResponse(html, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Content-Security-Policy": SANDBOXED_HTML_CSP,
			"X-Content-Type-Options": "nosniff",
			"Referrer-Policy": "no-referrer",
		},
	});
}
