import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  await Promise.all(getJobs().map((job) => db.job.create({ data: job })));
}

seed();

// const user = {
//   id: "1",
//   email: "wtse.ucsd@gmail.com",
//   name: "Francis",
//   jobs: [],
// };

function getJobs() {
  return [
    {
      id: "1",
      company: "X",
      title: "Software Engineer",
      description: "A job at X company",
      // user,
      // userId: user.id,
      createdAt: new Date("2022-12-28"),
    },
    {
      id: "2",
      title: "Software Engineer 2",
      company: "Y",
      description: "A job at Y company",
      // user,
      // userId: user.id,
      createdAt: new Date("2022-12-30"),
    },
    {
      id: "3",
      company: "Z",
      title: "Senior Software Engineer",
      description: "A job at Z company",
      // user,
      // userId: user.id,
      createdAt: new Date("2023-01-02"),
    },
    {
      id: "4",
      company: "XZ",
      title: "Mid level Software Engineer",
      description: "A job at XZ company",
      // user,
      // userId: user.id,
      createdAt: new Date("2023-01-02"),
      status: "interviewing",
    },
  ];
}
