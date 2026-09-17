# second-brain

[second-brain](https://github.com/albegosu/second-brain) files the posts and pages you share into a private Markdown wiki. When something you save sparks a thought of your own, it can plant that thought in your garden as a latent embryo.

```
share a post ──► second-brain worker (GitHub Actions) ──► POST /api/integrations/embryos ──► LATENT embryo
                     files the capture in the wiki             Bearer hyp_…
```

## What arrives

- **The seed is your note**, the text you typed when sharing — never the model's summary of the post. A capture shared without a note plants nothing.
- **The source stays beside the seed:** `sourceUrl` (the original post) and `sourceRef` (the source note in your wiki repository). The embryo page links to both. The wiki link opens on GitHub, so only people with access to that private repository can read it.
- **Nothing else from the wiki** is sent. The agent still works from your garden alone.
- The `CREATED` event is initiated by `SYSTEM` and records the token name as `via`.
- Delivery is idempotent on `sourceUrl`: a retried capture returns the embryo already planted.

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
{ "seed": "…", "sourceUrl": "https://…", "sourceRef": "https://github.com/…/wiki/sources/…md" }
```

Returns `201 { created: true, embryo }`, or `200 { created: false, embryo }` when an embryo with that `sourceUrl` already exists. Only `http(s)` links are kept. Rate limited to 30 requests per minute per IP.

Sessions don't authenticate integration routes, and tokens don't authenticate the rest of the API.
