import Column from "~/components/Column";
import type { Job } from "~/types";
import React from "react";
import { db } from "~/utils/db.server";
import { json, type LoaderArgs, type ActionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { getUser, requireUserId } from "~/utils/session.server";
import AddJobModal from "~/components/AddJobModal";

const FormSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  listId: z.number().min(1),
  userId: z.string().min(1),
});

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const company = form.get("company");
  const title = form.get("jobTitle");
  const listId = Number(form.get("list"));

  const data = {
    company,
    title,
    listId,
    userId,
  };

  const result = FormSchema.safeParse(data);

  if (!result.success) {
    return json({ error: result.error.issues });
  } else {
    const res = await db.job.create({
      data: result.data,
    });

    return res;
  }
};

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
        <AddJobModal listId={selectedListId} setIsModalOpen={setIsModalOpen} />
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
