<DocMicroLead />

# Roles & permissions

hypar has two independent role axes:

1. **Application role** on the `User` model — `user` or `admin`.
2. **Workspace role** on the `WorkspaceMember` model — `owner`, `editor` or `viewer`.

A user can be a workspace `owner` without being a global `admin`, and vice versa.

## Application role

Stored as `User.role` (default `'user'`). Set by the better-auth `admin` plugin and by the first-run setup wizard.

| Role | What it unlocks |
| --- | --- |
| `user` | Default for every signup. Can use chat, upload documents, manage their own settings, belong to workspaces. |
| `admin` | Everything above, plus full access to the `/admin/*` pages and `/api/admin/*` endpoints. |

The server-side check is `requireAdmin(event)` in `server/utils/admin-auth.ts`. It also accepts a fallback `Authorization: Bearer <ADMIN_API_KEY>` (or `x-admin-key`) header for CI scripts when `ADMIN_API_KEY` is set.

Client-side, `useAuth()` exposes `isAdmin`, and `middleware/admin.ts` gates admin pages.

### Promoting / demoting

From the [admin panel](./admin-panel) (`/admin/users`) or via the API:

```bash
curl -X PATCH http://localhost:3000/api/admin/users/<USER_ID> \
  -H 'Content-Type: application/json' \
  -H "x-admin-key: $ADMIN_API_KEY" \
  -d '{"role":"admin"}'
```

`PATCH /api/admin/users/:id` also accepts `{ banned: true|false }` to disable an account without deleting it.

## Workspace role

Stored as `WorkspaceMember.role` (default `'editor'`). Created automatically as `owner` for whoever calls `POST /api/workspaces`, and as `editor` for invitees unless the inviter passes `role: 'viewer'`.

| Role | List workspace | Activate | Read settings | Change settings | Invite members |
| --- | :-: | :-: | :-: | :-: | :-: |
| `owner` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `editor` | ✓ | ✓ | ✓ | ✓ | — |
| `viewer` | ✓ | ✓ | ✓ | — | — |

The enforcement points are `requireWorkspaceMember()` and `requireWorkspaceEditor()` in the workspace settings handlers, and the explicit owner check in `server/api/workspaces/[id]/members.post.ts`.

## Choosing the right axis

- Permissions tied to **infrastructure / configuration** (global settings, user management, usage analytics) → application `admin`.
- Permissions tied to **content / collaboration** (who can edit a particular set of documents) → workspace `owner` / `editor` / `viewer`.

## Next steps

- [Admin panel →](./admin-panel)
- [Workspaces →](./workspaces)
