import type { Job } from "~/types";

export function selectJobsByColumn(jobs: Job[]) {
  const jobsByColumn: Record<string, Job[]> = {};

  for (const job of jobs) {
    // defaults to 'applied' if there's no status associated with the job card
    if (!job.status) {
      jobsByColumn["applied"] = [...(jobsByColumn["applied"] || []), job];
    } else {
      if (job.status in jobsByColumn) {
        jobsByColumn[job.status] = [...jobsByColumn[job.status], job];
      } else {
        jobsByColumn[job.status] = [job];
      }
    }
  }

  return jobsByColumn;
}
