import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateThread, deleteThread } from "../services/threads.service";

export default function ThreadItem({ thread }) {
  const [title, setTitle] = useState(thread.title);
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();

  // Edit mutation - PUT
  const editMutation = useMutation({
    mutationFn: ({ id, data }) => updateThread(id, data),

    onSuccess: (updated, { id }) => {
      // Refresh the threads list
      queryClient.invalidateQueries({
        queryKey: ["threads"],
      });

      // Refresh this specific thread's detail
      queryClient.invalidateQueries({
        queryKey: ["thread", id],
      });

      setEditing(false);
    },
  });

  // Delete mutation - DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteThread,

    onSuccess: () => {
      // Only the threads list needs to be refreshed
      queryClient.invalidateQueries({
        queryKey: ["threads"],
      });
    },
  });

  function handleSave() {
    editMutation.mutate({
      id: thread.id,
      data: { title },
    });
  }

  function handleDelete() {
    deleteMutation.mutate(thread.id);
  }

  if (editing) {
    return (
      <li className="card">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          disabled={editMutation.isPending}
          onClick={handleSave}
        >
          {editMutation.isPending ? "Saving..." : "Save"}
        </button>
      </li>
    );
  }

  return (
    <li className="card">
      <h3>{thread.title}</h3>

      <p>{thread.body}</p>

      <button onClick={() => setEditing(true)}>
        Edit
      </button>

      <button
        disabled={deleteMutation.isPending}
        onClick={handleDelete}
      >
        {deleteMutation.isPending ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
}