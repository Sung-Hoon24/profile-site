const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const EXCLUDE_DIRS = new Set([".git", "node_modules", "dist", ".firebase", "build"]);
const TEXT_EXT = new Set([".js", ".ts", ".tsx", ".jsx", ".json", ".md", ".html", ".css", ".txt", ".yml", ".yaml", ".env", ".toml"]);

function isTextFile(p) {
    const ext = path.extname(p).toLowerCase();
    const base = path.basename(p);
    if (base.startsWith(".env")) return true;
    return TEXT_EXT.has(ext);
}

function walk(dir, out = []) {
    try {
        const files = fs.readdirSync(dir);
        for (const name of files) {
            const p = path.join(dir, name);
            try {
                const st = fs.statSync(p);
                if (st.isDirectory()) {
                    if (!EXCLUDE_DIRS.has(name)) walk(p, out);
                } else if (isTextFile(p)) {
                    out.push(p);
                }
            } catch (e) {
                console.error(`Error accessing ${p}: ${e.message}`);
            }
        }
    } catch (e) {
        console.error(`Error reading dir ${dir}: ${e.message}`);
    }
    return out;
}

function isValidUtf8(buf) {
    try { new TextDecoder("utf-8", { fatal: true }).decode(buf); return true; }
    catch { return false; }
}

console.log("Starting UTF-8 Scan...");
const files = walk(process.cwd());
console.log(`Scanned ${files.length} files.`);
const bad = [];

for (const f of files) {
    try {
        const buf = fs.readFileSync(f);
        const hasNull = buf.includes(0);
        let ok = true;
        try {
            new TextDecoder("utf-8", { fatal: true }).decode(buf);
        } catch (e) {
            ok = false;
        }

        if (hasNull || !ok) {
            bad.push({ f, hasNull, ok });
        }
    } catch (e) {
        console.error(`Error reading file ${f}: ${e.message}`);
        bad.push({ f, error: e.message });
    }
}

if (!bad.length) console.log("✅ No UTF-8 issues found.");
else {
    console.log("❌ Suspect files:");
    bad.forEach(x => {
        if (x.error) console.log(`- ${x.f}\n  Error: ${x.error}`);
        else console.log(`- ${x.f}\n  UTF-8 OK: ${x.ok}\n  Contains NUL: ${x.hasNull}`);
    });
    process.exitCode = 1;
}
