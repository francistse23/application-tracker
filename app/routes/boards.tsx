import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return json({
    jobs: await db.job.findMany(),
  });
};

export default function Boards() {
  const data = useLoaderData<typeof loader>();

  return (
    <ul>
      {data.jobs.map((job) => (
        <li key={job.id}>{job.title}</li>
      ))}
    </ul>
  );
}
