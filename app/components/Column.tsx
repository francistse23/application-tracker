import * as React from "react";

import type { Dispatch, SetStateAction } from "react";

import Card from "~/components/Card";
import type { Job } from "~/types";

type ColumnProps = {
  listId: number;
  name: string;
  jobs: Job[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedListId: Dispatch<SetStateAction<number>>;
};

export default function Column({
  listId,
  name,
  jobs,
  setIsModalOpen,
  setSelectedListId,
}: ColumnProps) {
  const handleModalOpen = React.useCallback(() => {
    setSelectedListId(listId);
    setIsModalOpen((state: boolean) => !state);
  }, [listId, setIsModalOpen, setSelectedListId]);

  return (
    <div>
      <h3>{name}</h3>
      <h4>{jobs.length} jobs</h4>

      <button onClick={handleModalOpen}>+</button>

      <div>
        {jobs.map((job) => (
          <Card key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
