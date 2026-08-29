# Threadbase — Edit & Delete (PUT / DELETE + Selective Invalidation) Starter
# updated
A React (Vite) + Express scaffold. The Express `PUT /api/threads/:id` and
`DELETE /api/threads/:id` endpoints work, the Axios client, the `QueryClientProvider`,
the `getThreads` / `updateThread` / `deleteThread` services, and the `ThreadList`
(which reads the `['threads']` query and renders a `ThreadItem` per thread) are all **done**.
Your job is to wire the Edit and Delete buttons in `ThreadItem` to mutations — and invalidate
exactly the right query keys for each.

## Run it

```bash
npm run setup     # installs root + server + client deps
cp client/.env.development.example client/.env.development
npm run dev       # Express on :3001, Vite on :5173
```

Open http://localhost:5173. Click **Edit** → change the title → **Save**, or click **Delete**.
Right now both only log to the console: nothing is written to the server and the list never changes.

## Your task — edit `client/src/components/ThreadItem.jsx`

1. `import { useMutation, useQueryClient } from "@tanstack/react-query"` and get the client
   with `useQueryClient()`.
2. **Edit mutation:** `mutationFn: ({ id, data }) => updateThread(id, data)`. Fire it with
   `editMutation.mutate({ id: thread.id, data: { title } })`. Disable Save while `isPending`.
   In `onSuccess`, invalidate **both** `["threads"]` (the list) **and** `["thread", id]` (the detail).
3. **Delete mutation:** `mutationFn: deleteThread`. Fire it with `deleteMutation.mutate(thread.id)`.
   Disable Delete while `isPending`. In `onSuccess`, invalidate **only** `["threads"]`.

## What you should NOT touch

- `server/` — the API already handles `GET`, `POST`, `PUT`, and `DELETE`.
- `apiClient.js`, `main.jsx`, `threads.service.js`, `ThreadList.jsx` — all done.

## Verify

- DevTools → **Network**: **Save** fires `PUT /api/threads/:id` → **200**, immediately followed by
  a `GET /api/threads` refetch. The row's title updates with no reload.
- **Delete** fires `DELETE /api/threads/:id` → **204**, followed by a `GET /api/threads` refetch,
  and the row disappears.
- In **ReactQueryDevtools**, after each mutation the exact keys you invalidated flip to *stale*.
  Edit touches two keys; delete touches one.
