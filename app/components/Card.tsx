import type { Job } from "~/types";

type CardProps = {
  job: Job;
  handleClick: (job: Job) => void;
};

export default function Card({ job, handleClick }: CardProps) {
  return (
    <div className="job" onClick={() => handleClick(job)}>
      <div>{job.company}</div>
      <div>{job.title}</div>
    </div>
  );
}
