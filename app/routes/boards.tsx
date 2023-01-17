import { Outlet, useLoaderData } from "@remix-run/react";

import Column from "~/components/Column";
import type { Job } from "~/types";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import { selectJobsByColumn } from "~/selectors/selectJobsByColumn";

export const loader = async () => {
  const board = await db.board.findUniqueOrThrow({
    where: { name: "default" },
    select: { lists: { include: { jobs: true } } },
  });
  // const lists = await db.list.findMany();
  // console.log({ lists: board.lists });
  // const allJobs = await db.job.findMany();
  // const jobsByColumn = selectJobsByColumn(allJobs);

  return json({ lists: board.lists });
};

export default function Boards() {
  const { lists } = useLoaderData<typeof loader>();

  return (
    <div>
      <Outlet />
      <div>
        {lists
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(({ name, jobs }) => (
            <Column key={name} name={name} jobs={jobs as unknown as Job[]} />
          ))}
      </div>
    </div>
  );
}
