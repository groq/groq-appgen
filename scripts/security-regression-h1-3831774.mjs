import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function read(path) {
	return readFileSync(join(root, path), "utf8");
}

const helper = read("src/server/sandboxed-html.ts");
const appRoute = read("src/app/api/apps/[sessionId]/[version]/route.ts");
const rawRoute = read("src/app/api/apps/[sessionId]/[version]/raw/route.ts");
const sharedPage = read("src/app/apps/[sessionId]/[version]/page.tsx");

assert.match(
	helper,
	/Content-Security-Policy/,
	"raw HTML responses must include a CSP header",
);
assert.match(
	helper,
	/sandbox allow-scripts allow-forms allow-popups allow-modals allow-downloads/,
	"raw HTML responses must be CSP sandboxed",
);
assert.doesNotMatch(
	helper,
	/allow-same-origin/,
	"raw HTML CSP sandbox must not allow same-origin script execution",
);
assert.match(
	helper,
	/X-Content-Type-Options/,
	"raw HTML responses must opt out of content sniffing",
);

assert.match(
	appRoute,
	/renderSandboxedHtml\(data\.html\)/,
	"?raw=true must use the sandboxed HTML response helper",
);
assert.match(
	rawRoute,
	/renderSandboxedHtml\(data\.html\)/,
	"/raw must use the sandboxed HTML response helper",
);
assert.doesNotMatch(
	appRoute,
	/"Content-Type":\s*"text\/html"/,
	"?raw=true must not define an unsandboxed direct text/html response",
);
assert.doesNotMatch(
	rawRoute,
	/"Content-Type":\s*"text\/html"/,
	"/raw must not define an unsandboxed direct text/html response",
);

const iframe = sharedPage.match(/<iframe[\s\S]*?srcDoc=\{html\}[\s\S]*?\/>/)?.[0] ?? "";
assert.match(iframe, /sandbox=/, "shared app iframe must be sandboxed");
assert.doesNotMatch(
	iframe,
	/allow-same-origin/,
	"shared app iframe sandbox must not allow same-origin script execution",
);

console.log("H1-3831774 regression checks passed");
