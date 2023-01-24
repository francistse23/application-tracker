import Column from "~/components/Column";
import type { Job } from "~/types";
import React from "react";
import { db } from "~/utils/db.server";
import { json, type LoaderArgs, type ActionArgs } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react";
import { z } from "zod";
import { getUser, requireUserId } from "~/utils/session.server";
import AddJobModal from "~/components/AddJobModal";

import { CardDetailModal } from "~/components/CardDetailModal";

const FormSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  listId: z.number().min(1),
  userId: z.string().min(1),
});

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const userId = await requireUserId(request);
  const intent = form.get("intent");

  if (intent !== "delete") {
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
  } else {
    // check if it's the same user who created the job
    const job = JSON.parse(z.string().parse(form.get("json")));

    const jobInDb = await db.job.findUniqueOrThrow({ where: { id: job.id } });

    if (!jobInDb) {
      throw new Response("Can't delete what does not exist", {
        status: 404,
      });
    }

    if (job.userId !== userId) {
      throw new Response("Cannot delete the job since you're not authorized", {
        status: 403,
      });
    }

    await db.job.delete({ where: { id: job.id } });
    return null;
  }
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await getUser(request);
  const board = await db.board.findUnique({
    where: { id: Number(params.boardId) },
  });
  const lists = await db.list.findMany({
    where: { boardId: Number(params.boardId) },
    include: { jobs: true },
  });

  if (!board) {
    throw new Response("Uh oh. We cannot find the job board", { status: 404 });
  }

  return json({ lists, user });
};

export default function BoardRoute() {
  const { lists, user } = useLoaderData<typeof loader>();
  // add job modal states
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedListId, setSelectedListId] = React.useState<number>(-1);
  // job detail modal states
  const [isDetailOpen, setIsDetailOpen] = React.useState<boolean>(false);
  const [currentJob, setCurrentJob] = React.useState<Job | null>(null);

  const handleOnCardClick = React.useCallback((job: Job) => {
    setIsDetailOpen((state) => !state);
    setCurrentJob(job);
  }, []);

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

      {/* // confirm modal to delete? */}
      {isDetailOpen && (
        <CardDetailModal job={currentJob} setIsDetailOpen={setIsDetailOpen} />
      )}
      {lists
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(({ id, name, jobs }) => (
          <Column
            key={id}
            listId={id}
            name={name}
            handleClick={handleOnCardClick}
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
export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  if (caught.status === 404) {
    return (
      <div>{`We cannot find the job board with the id ${params.boardId}`}</div>
    );
  }

  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { boardId } = useParams();
  return (
    <div>{`There was an error loading the board with the id ${boardId}. Please reload the page. If the issue is persisting, please contact the support team.`}</div>
  );
}
