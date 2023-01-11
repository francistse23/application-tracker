import * as React from "react";

import type { Dispatch, SetStateAction } from "react";

import Card from "~/components/Card";
import type { Job } from "~/types";

type ColumnProps = {
  name: string;
  jobs: Job[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Column({ name, jobs, setIsModalOpen }: ColumnProps) {
  const handleModalOpen = React.useCallback(
    () => setIsModalOpen((state: boolean) => !state),
    [setIsModalOpen]
  );

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
