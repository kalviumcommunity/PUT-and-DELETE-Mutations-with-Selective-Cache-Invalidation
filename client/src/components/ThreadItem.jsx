// ─────────────────────────────────────────────────────────────
// TODO: This is your work area. Wire up TWO mutations — edit and delete.
//
// Right now the Save and Delete buttons only log to the console: nothing
// is written to the server, and the list never refreshes.
//
// The service functions are already implemented for you (see threads.service.js):
//   updateThread(id, data)   → PUT /api/threads/:id   (returns the updated thread)
//   deleteThread(id)         → DELETE /api/threads/:id (returns 204 No Content)
//
// Requirements (the auto-grader checks these):
//   import { useMutation, useQueryClient } from "@tanstack/react-query";
//   const queryClient = useQueryClient();
//
//   // EDIT — mutationFn calls updateThread(id, data); on success invalidate BOTH keys:
//   const editMutation = useMutation({
//     mutationFn: ({ id, data }) => updateThread(id, data),
//     onSuccess: (updated, { id }) => {
//       queryClient.invalidateQueries({ queryKey: ["threads"] });      // the list
//       queryClient.invalidateQueries({ queryKey: ["thread", id] });   // this detail
//       setEditing(false);
//     },
//   });
//   // fire it: editMutation.mutate({ id: thread.id, data: { title } })
//   // disable the Save button while editMutation.isPending
//
//   // DELETE — mutationFn calls deleteThread(id); on success invalidate ONLY the list:
//   const deleteMutation = useMutation({
//     mutationFn: deleteThread,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["threads"] });      // list only
//     },
//   });
//   // fire it: deleteMutation.mutate(thread.id)
//   // disable the Delete button while deleteMutation.isPending
//
// Verify in DevTools → Network:
//   • Save → a PUT /api/threads/:id (200) immediately followed by a GET /api/threads refetch.
//   • Delete → a DELETE /api/threads/:id (204) followed by the row disappearing from the list.
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateThread, deleteThread } from "../services/threads.service";

export default function ThreadItem({ thread }) {
  const [title, setTitle] = useState(thread.title);
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: ({ id, data }) => updateThread(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteThread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  function handleSave() {
    editMutation.mutate({ id: thread.id, data: { title } });
  }

  function handleDelete() {
    deleteMutation.mutate(thread.id);
  }

  if (editing) {
    return (
      <li className="card">
        <input
          className="edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="row">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={editMutation.isPending}
          >
            {editMutation.isPending ? "Saving..." : "Save"}
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              setTitle(thread.title);
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="card">
      <h3>{thread.title}</h3>
      <p>{thread.body}</p>
      <div className="row">
        <button className="btn-ghost" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button
          className="btn-danger"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}
