import Card from "~/components/Card";
import type { Job } from "~/types";

export default function Column({ name, jobs }: { name: string; jobs: Job[] }) {
  return (
    <div>
      <h3>{name}</h3>
      <h4>{jobs.length} jobs</h4>
      <div>
        {jobs.map((job) => (
          <Card key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
