import type { Dispatch, SetStateAction } from "react";

import { Form } from "@remix-run/react";
import type { Job } from "~/types";

type CardDetailModalProps = {
  job: Job | null;
  setIsDetailOpen?: Dispatch<SetStateAction<boolean>>;
};

export const CardDetailModal = ({ job }: CardDetailModalProps) => {
  if (!job) return null;

  const { company, title, description, url } = job;

  return (
    <div>
      <Form method="post">
        <input type="hidden" name="json" value={JSON.stringify(job)} />
        <button type="submit" name="intent" value="delete">
          Delete
        </button>
      </Form>
      <div>
        <div>{company}</div>
        <div>{title}</div>
        <div>{description}</div>
        <div>{url}</div>
      </div>
    </div>
  );
};
