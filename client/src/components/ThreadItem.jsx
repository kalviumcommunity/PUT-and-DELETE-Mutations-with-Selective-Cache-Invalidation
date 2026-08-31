import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateThread, deleteThread } from "../services/threads.service";

export default function ThreadItem({ thread }) {
  const [title, setTitle] = useState(thread.title);
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();

  // EDIT MUTATION
  const editMutation = useMutation({
    mutationFn: ({ id, data }) => {
      console.log("MUTATION RUNNING", id, data);
      return updateThread(id, data);
    },

    onSuccess: () => {
      console.log("UPDATE SUCCESS");

      queryClient.invalidateQueries({
        queryKey: ["threads"],
      });

      setEditing(false);
    },

    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: (id) => {
      console.log("DELETE MUTATION RUNNING", id);
      return deleteThread(id);
    },

    onSuccess: () => {
      console.log("DELETE SUCCESS");

      queryClient.invalidateQueries({
        queryKey: ["threads"],
      });
    },

    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });

  function handleSave() {
    console.log("SAVE CLICKED");

    editMutation.mutate({
      id: thread.id,
      data: {
        title: title,
      },
    });
  }

  function handleDelete() {
    console.log("DELETE CLICKED");

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
            disabled={editMutation.isPending}
            onClick={handleSave}
          >
            {editMutation.isPending ? "Saving..." : "Save"}
          </button>

          <button
            className="btn-ghost"
            disabled={editMutation.isPending}
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
        <button
          className="btn-ghost"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>

        <button
          className="btn-danger"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}