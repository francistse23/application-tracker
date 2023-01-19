import Column from "~/components/Column";
import CreateJobModal from "~/components/CreateJobModal";
import type { Job } from "~/types";
import React from "react";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const board = await db.board.findUniqueOrThrow({
    where: { name: "default" },
    select: { lists: { include: { jobs: true } } },
  });

  return json({ lists: board.lists });
};

export default function BoardRoute() {
  const { lists } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedListId, setSelectedListId] = React.useState<number>(-1);

  return (
    <div>
      {isModalOpen && <CreateJobModal listId={selectedListId} />}
      {lists
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(({ id, name, jobs }) => (
          <Column
            key={id}
            listId={id}
            name={name}
            setIsModalOpen={setIsModalOpen}
            setSelectedListId={setSelectedListId}
            // manually casting because of Remix's typing issue
            // jobs is being typed as SerializeObject<UnknownToOptional<T>>/>
            jobs={jobs as unknown as Job[]}
          />
        ))}
    </div>
  );
}
