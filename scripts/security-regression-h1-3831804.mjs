import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

const reportRoute = read("src/app/api/report/route.ts");
const blockRoute = read("src/app/api/block/route.ts");
const blockPage = read("src/app/block/page.tsx");
const reportButton = read("src/app/components/report-button.tsx");

const checks = [
  {
    name: "report route never reads BLOCK_SECRET",
    pass: !reportRoute.includes("BLOCK_SECRET"),
  },
  {
    name: "report route never returns a ban URL field",
    pass: !/\bbanUrl\b|\bban_url\b/.test(reportRoute),
  },
  {
    name: "report route does not trust caller supplied rootUrl",
    pass: !/\brootUrl\b/.test(reportRoute),
  },
  {
    name: "report button no longer sends caller supplied rootUrl",
    pass: !/\brootUrl\b/.test(reportButton),
  },
  {
    name: "block API no longer exposes a GET handler",
    pass: !/export\s+async\s+function\s+GET/.test(blockRoute),
  },
  {
    name: "block API requires a header secret instead of a query token",
    pass: blockRoute.includes('"x-block-secret"') && !/searchParams|get\("token"\)/.test(blockRoute),
  },
  {
    name: "block page no longer calls the destructive API from the browser",
    pass: !/api\/block|token|searchParams/.test(blockPage),
  },
];

const failures = checks.filter((check) => !check.pass);

if (failures.length > 0) {
  console.error("H1-3831804 regression checks failed:");
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`H1-3831804 regression checks passed (${checks.length} checks).`);
