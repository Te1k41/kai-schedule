// Syntax-only check for every page's inline module script plus every
// standalone .js file — no bundler, no dependencies, just node --check.
// Run: node scripts/check-syntax.js

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kai-check-"));
let failures = [];

function checkSource(label, source) {
  const tmpFile = path.join(tmpDir, "check.mjs");
  fs.writeFileSync(tmpFile, source);
  try {
    execFileSync(process.execPath, ["--check", tmpFile], { stdio: "pipe" });
  } catch (e) {
    failures.push(`${label}\n${e.stderr.toString()}`);
  }
}

const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const scriptRe = /<script type="module">([\s\S]*?)<\/script>/g;
  let match, i = 0;
  while ((match = scriptRe.exec(html))) {
    checkSource(`${file} (inline module script #${++i})`, match[1]);
  }
}

// node --check on a bare .js file silently under-validates once it
// auto-detects top-level import/export (module syntax) — forcing the .mjs
// extension is what makes it actually parse the whole file. Copy to a temp
// .mjs rather than checking script.js by its native path.
const jsFiles = fs.readdirSync(ROOT).filter(f => f.endsWith(".js"));
for (const file of jsFiles) {
  checkSource(file, fs.readFileSync(path.join(ROOT, file), "utf8"));
}

fs.rmSync(tmpDir, { recursive: true, force: true });

if (failures.length) {
  console.error(`${failures.length} syntax problem(s):\n`);
  console.error(failures.join("\n---\n"));
  process.exit(1);
}
console.log(`OK — checked ${htmlFiles.length} HTML file(s) and ${jsFiles.length} .js file(s), no syntax errors.`);
