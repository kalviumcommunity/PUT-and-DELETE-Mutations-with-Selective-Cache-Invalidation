import apiClient from "./apiClient";

export async function getThreads() {
  const response = await apiClient.get("/api/threads");

  return response.data;
}

export async function updateThread(id, data) {
  const response = await apiClient.put("/api/threads/" + id, data);

  return response.data;
}

export async function deleteThread(id) {
  await apiClient.delete("/api/threads/" + id);
}