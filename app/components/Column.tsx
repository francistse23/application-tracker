import * as React from "react";

import type { Dispatch, SetStateAction } from "react";

import Card from "~/components/Card";
import type { Job } from "~/types";

type ColumnProps = {
  listId: number;
  name: string;
  jobs: Job[];
  handleClick: (job: Job) => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedListId: Dispatch<SetStateAction<number>>;
};

export default function Column({
  listId,
  name,
  jobs,
  handleClick,
  setIsModalOpen,
  setSelectedListId,
}: ColumnProps) {
  const handleModalOpen = React.useCallback(() => {
    setSelectedListId(listId);
    setIsModalOpen((state: boolean) => !state);
  }, [listId, setIsModalOpen, setSelectedListId]);

  return (
    <div className="list-container">
      {/* TODO：add edit title function */}
      <h5 className="list-title">{name}</h5>
      <h6 className="num-jobs">
        {jobs.length} {jobs.length > 1 ? "Jobs" : "Job"}
      </h6>

      <button className="button" onClick={handleModalOpen}>
        +
      </button>

      <div className="jobs-container">
        {jobs.map((job) => (
          <Card key={job.id} job={job} handleClick={handleClick} />
        ))}
      </div>
    </div>
  );
}
