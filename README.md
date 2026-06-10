# PerSQL preview-DB demo

[![Open in PerSQL](https://github.persql.com/badge.svg)](https://github.persql.com/r/persql/preview-db-demo)

A working example of **one isolated SQLite branch per pull request**,
powered by [PerSQL](https://persql.com) and
[`persql/preview-db-action`](https://github.com/persql/preview-db-action).

Open any pull request in this repo and CI will:

1. **Claim a branch** of the `preview-demo` database named after the
   PR (`pr-42`). The branch carries the parent's schema with empty
   tables, provisions in milliseconds, and auto-deletes when its
   24-hour lease expires — no teardown job.
2. **Apply the repo's migrations** (`migrations/*.sql`) to the branch.
3. **Run the smoke test** against it. Writes are fully isolated — the
   parent database never sees them.
4. **Comment on the PR** with the branch name and expiry.

See it in action: check the [pull requests](../../pulls) for the live
comment and a green run.

## The interesting part

The whole integration is one CI step:

```yaml
- name: Claim preview branch
  id: persql
  uses: persql/preview-db-action@v1
  with:
    token: ${{ secrets.PERSQL_TOKEN }}
    database: your-namespace/your-db
    branch: pr-${{ github.event.pull_request.number }}
```

Every later step gets a token scoped to *that branch only* via
`steps.persql.outputs.token`, and the branch's API URL via
`steps.persql.outputs.database-slug`. Re-running the workflow is
idempotent: the same ref is reset to the parent's current schema, so
each run starts from a clean slate.

## Run it on your own repo

1. Create a database at [console.persql.com](https://console.persql.com)
   and mint an API token under **Tokens**.
2. Add the token as a `PERSQL_TOKEN` repository secret.
3. Copy `.github/workflows/preview-db.yml` and change the `database:`
   input to your `namespace/db`.

Full walkthrough: [docs.persql.com/recipes/pr-preview-db](https://docs.persql.com/recipes/pr-preview-db/).

## Repo layout

| Path | What |
| --- | --- |
| `migrations/*.sql` | Plain-SQL migrations, applied in filename order on every PR run. |
| `scripts/persql.mjs` | The entire database client — a `fetch` wrapper, no dependencies. |
| `test/smoke.mjs` | Writes and reads on the branch; asserts isolation. |
| `.github/workflows/preview-db.yml` | The CI wiring, including the PR comment. |

## License

MIT.
