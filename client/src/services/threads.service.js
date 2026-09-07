// Already wired for you. You do NOT need to edit this.

// getThreads reads the list; updateThread performs the PUT; deleteThread performs the DELETE.

// Use updateThread and deleteThread as your mutationFns in ThreadItem.jsx.

import apiClient from "./apiClient";

export async function getThreads() {
  const response = await apiClient.get("/api/threads");

  return response.data;
}

// EDIT — two arguments: which thread, and the new data.

export async function updateThread(id, data) {
  // data = { title, body }

  const response = await apiClient.put("/api/threads/" + id, data);

  return response.data; // the updated thread (200)
}

// DELETE — only the id. The server returns 204 No Content, so there is no body to read.

export async function deleteThread(id) {
  await apiClient.delete("/api/threads/" + id);
}
