// Applies migrations/*.sql (sorted) to the database at PERSQL_URL.
// The preview branch is reset to the parent's schema on every claim,
// so each CI run applies the full migration set to a clean slate.
import { readdir, readFile } from "node:fs/promises";
import { sql } from "./persql.mjs";

const files = (await readdir("migrations")).filter((f) => f.endsWith(".sql")).sort();

for (const file of files) {
  const text = await readFile(`migrations/${file}`, "utf8");
  const statements = text
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sql(statement);
  }
  console.log(`applied ${file} (${statements.length} statement${statements.length === 1 ? "" : "s"})`);
}
