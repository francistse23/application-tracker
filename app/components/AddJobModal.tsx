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
    <div className="modal-container" onClick={() => setIsModalOpen(false)}>
      <Form
        method="post"
        className="job-details"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="company">Company</label>
            <input
              name="company"
              type="text"
              disabled={transition.state === "submitting"}
            />

            <label htmlFor="jobTitle">Job Title</label>
            <input
              name="jobTitle"
              placeholder="Job title"
              type="text"
              required
              disabled={transition.state === "submitting"}
            />
            {/* TODO: fix error rendered */}
            {actionData?.error ? (
              <div>{actionData?.error[0].message}</div>
            ) : null}
          </div>
          <div className="form-col">
            <label htmlFor="list">List</label>
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
          </div>
        </div>

        <div className="buttons-container">
          <button
            className="button danger-button"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button className="button" type="submit">
            {transition.state === "submitting" ? "Saving" : "Save"}
          </button>
        </div>
      </Form>
    </div>
  );
}
