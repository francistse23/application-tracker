import type { Job } from "~/types";

export default function Card({ job }: { job: Job }) {
  return (
    <div>
      <div>{job.company}</div>
      <div>{job.title}</div>
    </div>
  );
}
