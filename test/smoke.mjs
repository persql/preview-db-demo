// Smoke test against the PR's preview branch. Writes here never touch
// the parent database.
import assert from "node:assert/strict";
import { sql } from "../scripts/persql.mjs";

await sql("INSERT INTO todos (title) VALUES (?)", ["write the smoke test"]);
await sql("INSERT INTO todos (title, done) VALUES (?, 1)", ["claim a preview branch"]);

const count = await sql("SELECT COUNT(*) AS n FROM todos");
assert.equal(count.rows[0][0], 2, "expected exactly the rows this test wrote");

const open = await sql("SELECT title FROM todos WHERE done = 0");
assert.equal(open.rows.length, 1);
assert.equal(open.rows[0][0], "write the smoke test");

await sql("INSERT INTO todos (title, priority) VALUES (?, ?)", ["triage the backlog", 2]);
const urgent = await sql(
  "SELECT title FROM todos WHERE done = 0 ORDER BY priority DESC LIMIT 1"
);
assert.equal(urgent.rows[0][0], "triage the backlog");

console.log("smoke test passed");
