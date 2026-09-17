# second-brain

[second-brain](https://github.com/albegosu/second-brain) files the posts and pages you share into a private Markdown wiki. When something you save sparks a thought of your own, it can plant that thought in your garden as a latent embryo.

```
share a post ──► second-brain worker (GitHub Actions) ──► POST /api/integrations/embryos ──► LATENT embryo
                     files the capture in the wiki             Bearer hyp_…
```

## What arrives

- **The seed is your note**, the text you typed when sharing — never the model's summary of the post. A capture shared without a note plants nothing.
- **What sparked it stays beside the seed:** `sourceUrl` (the original post), `sourceRef` (the source note in your wiki repository), `sourceTitle` and `sourceContext`, the capture's essence as the wiki describes it (summary, what it shows, key ideas, visual style; never the quoted post text). The embryo page shows it folded under the seed, with both links. The wiki link opens on GitHub, so only people with access to that private repository can read it.
- **The agent reads the essence** as context for what "this" refers to, clipped to 4,000 characters, with a rule to challenge what you want from it and never to describe it back or suggest copying it.
- **The wiki's index** also arrives after every capture and weekly lint pass: topic and item names with their model-written summaries, never the saved posts or source notes. hypar keeps only the latest one per user (**Settings → saved references** shows it and can clear it). The agent doesn't use it yet; see [saved references as contrast](/experiments/saved-references-as-contrast).
- The `CREATED` event is initiated by `SYSTEM` and records the token name as `via`.
- Delivery is idempotent on `sourceUrl`: a retried capture returns the embryo already planted, and fills in source fields it was missing (so sharing an old capture again adds its essence).

## Connect it

1. In hypar, open **Settings → integrations** and create a token (the name defaults to `second-brain`). Copy it: only its SHA-256 hash is stored, so it can't be shown again.
2. In your wiki repository, add the secrets:

   ```bash
   gh secret set HYPAR_URL -R <owner>/second-brain-wiki     # e.g. https://hypar.example.com
   gh secret set HYPAR_TOKEN -R <owner>/second-brain-wiki   # the hyp_… token
   ```

3. Share a post with the Shortcut, choose **Idea to grow** and write the thought it gave you.

Revoke a token from the same settings panel; requests with it fail with `401` from then on.

## API

`POST /api/integrations/embryos` with `Authorization: Bearer hyp_…`

```json
{
  "seed": "…",
  "sourceUrl": "https://…",
  "sourceRef": "https://github.com/…/wiki/sources/…md",
  "sourceTitle": "Interactive Component Preview Hover",
  "sourceContext": "A grid of component cards…\n\n## What it shows\n…"
}
```

Returns `201 { created: true, embryo }`, or `200 { created: false, embryo }` when an embryo with that `sourceUrl` already exists. Only `http(s)` links are kept. Rate limited to 30 requests per minute per IP.

`PUT /api/integrations/references` with the same token

```json
{ "markdown": "# Second brain\n…", "commit": "9975bf6…" }
```

Replaces the user's snapshot of `wiki/index.md` (up to 200,000 characters) and returns `{ updatedAt, commit, topics, chars }`. Shares the rate limit above.

Sessions don't authenticate integration routes, and tokens don't authenticate the rest of the API.
