import Column from "~/components/Column";
import CreateJobModal from "~/components/CreateJobModal";
import type { Job } from "~/types";
import React from "react";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await getUser(request);
  const lists = await db.list.findMany({
    where: { boardId: Number(params.boardId) },
    include: { jobs: true },
  });

  return json({ lists, user });
};

export default function BoardRoute() {
  const { lists, user } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedListId, setSelectedListId] = React.useState<number>(-1);

  return (
    <div>
      {user ? (
        <div>
          <span>{`Hi ${user.username}`}</span>
          <form action="/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}

      {isModalOpen && (
        <CreateJobModal
          listId={selectedListId}
          setIsModalOpen={setIsModalOpen}
        />
      )}

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
