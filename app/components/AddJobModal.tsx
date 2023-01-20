import * as React from "react";

import type { Dispatch, SetStateAction } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { type LoaderArgs, json } from "@remix-run/node";
import { type ZodIssue } from "zod";
import { db } from "~/utils/db.server";

type FormError = {
  error: ZodIssue[];
};

export const loader = async ({ params }: LoaderArgs) => {
  const lists = await db.list.findMany({
    where: { boardId: Number(params.boardId) },
    select: { name: true, id: true },
  });

  return json({ lists });
};

type AddJobModalProps = {
  listId: number;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddJobModal({
  listId,
  setIsModalOpen,
}: AddJobModalProps) {
  const actionData = useActionData<() => FormError>();
  const transition = useTransition();
  const { lists } = useLoaderData<typeof loader>();
  const [selectedListId, setSelectedListId] = React.useState<number>(listId);

  return (
    <Form method="post">
      <span>Add job</span>
      <p>
        <label>
          Company
          <input
            name="company"
            type="text"
            disabled={transition.state === "submitting"}
          />
        </label>
      </p>
      <p>
        <label>
          Job Title
          <input
            name="jobTitle"
            type="text"
            disabled={transition.state === "submitting"}
          />
          {/* TODO: fix error rendered */}
          {actionData?.error ? <div>{actionData?.error[0].message}</div> : null}
        </label>
      </p>

      <p>
        <label>
          List
          <select
            name="list"
            onChange={(e) => setSelectedListId(Number(e.target.value))}
            defaultValue={selectedListId}
            disabled={transition.state === "submitting"}
          >
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </label>
      </p>
      <div>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        <button type="submit">
          {transition.state === "submitting" ? "Saving" : "Save"}
        </button>
      </div>
    </Form>
  );
}
