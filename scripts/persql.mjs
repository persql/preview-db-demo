// Minimal PerSQL /v1 client — no dependencies, just fetch.
// PERSQL_URL is the branch database base URL, e.g.
// https://api.persql.com/v1/db/<namespace>/<database-slug>
const url = process.env.PERSQL_URL;
const token = process.env.PERSQL_TOKEN;
if (!url || !token) {
  console.error("PERSQL_URL and PERSQL_TOKEN are required");
  process.exit(1);
}

export async function sql(statement, params = []) {
  const res = await fetch(`${url}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ sql: statement, params }),
  });
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return body.data;
}
