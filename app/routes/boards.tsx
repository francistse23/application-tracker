import * as React from "react";

import { Outlet, useLoaderData } from "@remix-run/react";

import Column from "~/components/Column";
import CreateJobModal from "~/components/CreateJobModal";
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
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  return (
    <div>
      <Outlet />
      <div>
        {isModalOpen && <CreateJobModal />}
        {Object.entries(jobs).map(([columnName, jobsInColumn]) => (
          <Column
            key={columnName}
            name={columnName}
            setIsModalOpen={setIsModalOpen}
            // manually casting because of Remix's typing issue
            // jobs is being typed as SerializeObject<UnknownToOptional<T>>
            jobs={jobsInColumn as unknown as Job[]}
          />
        ))}
      </div>
    </div>
  );
}
