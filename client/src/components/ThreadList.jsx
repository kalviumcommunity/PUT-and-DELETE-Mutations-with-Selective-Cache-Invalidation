// Already wired for you (this reads the ['threads'] query). You do NOT need to edit this.

// It renders one <ThreadItem /> per thread — your work happens inside ThreadItem.jsx.

import { useQuery } from "@tanstack/react-query";

import { getThreads } from "../services/threads.service";

import ThreadItem from "./ThreadItem.jsx";

export default function ThreadList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["threads"],
    queryFn: getThreads,
  });

  if (isPending) return <p>Loading threads…</p>;

  if (isError) return <p className="err">Error: {error.message}</p>;

  return (
    <ul className="threads">
      {data.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
    </ul>
  );
}