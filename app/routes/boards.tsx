import { Outlet, useLoaderData } from "@remix-run/react";

import Column from "~/components/Column";
import type { Job } from "~/types";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import { selectJobsByColumn } from "~/selectors/selectJobsByColumn";

export const loader = async () => {
  const allJobs = await db.job.findMany();
  const jobsByColumn = selectJobsByColumn(allJobs);

  return json({ jobs: jobsByColumn });
};

export default function Boards() {
  const { jobs } = useLoaderData<typeof loader>();

  return (
    <div>
      <Outlet />
      <div>
        {Object.entries(jobs).map(([columnName, jobsInColumn]) => (
          <Column
            key={columnName}
            name={columnName}
            jobs={jobsInColumn as unknown as Job[]}
          />
        ))}
      </div>
    </div>
  );
}
