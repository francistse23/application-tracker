import * as React from "react";

import { Outlet, useLoaderData } from "@remix-run/react";

import Column from "~/components/Column";
import CreateJobModal from "~/components/CreateJobModal";
import type { Job } from "~/types";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";

export const loader = async () => {
  const board = await db.board.findUniqueOrThrow({
    where: { name: "default" },
    select: { lists: { include: { jobs: true } } },
  });

  return json({ lists: board.lists });
};

export default function Boards() {
  const { lists } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  return (
    <div>
      <Outlet />
      <div>
        {isModalOpen && <CreateJobModal />}
        {lists
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(({ name, jobs }) => (
            <Column
              key={name}
              name={name}
              jobs={jobs as unknown as Job[]}
              setIsModalOpen={setIsModalOpen}
              // manually casting because of Remix's typing issue
              // jobs is being typed as SerializeObject<UnknownToOptional<T>>/>
            />
          ))}
      </div>
    </div>
  );
}
