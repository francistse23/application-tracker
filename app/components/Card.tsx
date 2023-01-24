import type { Job } from "~/types";

type CardProps = {
  job: Job;
  handleClick: (job: Job) => void;
};

export default function Card({ job, handleClick }: CardProps) {
  return (
    <div
      onClick={() => handleClick(job)}
      style={{
        border: "1px solid black",
      }}
    >
      <div>{job.company}</div>
      <div>{job.title}</div>
    </div>
  );
}
