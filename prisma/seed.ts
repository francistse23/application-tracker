import { type Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function seed() {
  const passwordHash = await bcrypt.hash(process.env.PASSWORD || "", 10);

  const user = await db.user.upsert({
    where: { email: "wtse.ucsd@gmail.com" },
    update: {},
    create: {
      email: "wtse.ucsd@gmail.com",
      username: "francistse",
      passwordHash,
      name: "Francis",
      boards: {
        create: [
          {
            name: "default",
          },
        ],
      },
    },
  });

  const defaultBoard = await db.board.findUniqueOrThrow({
    where: {
      name: "default",
    },
  });

  const lists: Prisma.ListCreateInput[] = [
    {
      name: "applied",
      sortOrder: 1,
      board: {
        connect: {
          id: defaultBoard.id,
        },
      },
    },
    {
      name: "interview",
      sortOrder: 2,
      board: {
        connect: {
          id: defaultBoard.id,
        },
      },
    },
    {
      name: "offer",
      sortOrder: 3,
      board: {
        connect: {
          id: defaultBoard.id,
        },
      },
    },
    {
      name: "rejected",
      sortOrder: 4,
      board: {
        connect: {
          id: defaultBoard.id,
        },
      },
    },
  ];

  const [applied, interviewing] = await Promise.all(
    lists.map(async (list) => await db.list.create({ data: list }))
  );

  const jobs: Prisma.JobCreateInput[] = [
    {
      company: "X",
      title: "Software Engineer",
      user: {
        connect: {
          id: user.id,
        },
      },
      list: {
        connect: {
          id: applied.id,
        },
      },
    },
    // {
    //   title: "Software Engineer 2",
    //   company: "Y",
    //   description: "A job at Y company",
    //   user: {
    //     connect: {
    //       id: user.id,
    //     },
    //   },
    //   list: {
    //     connect: {
    //       id: applied.id,
    //     },
    //   },
    // },
    // {
    //   company: "Z",
    //   title: "Senior Software Engineer",
    //   description: "A job at Z company",
    //   user: {
    //     connect: {
    //       id: user.id,
    //     },
    //   },
    //   list: {
    //     connect: {
    //       id: applied.id,
    //     },
    //   },
    // },
    {
      company: "XZ",
      title: "Mid level Software Engineer",
      description: "A job at XZ company",
      user: {
        connect: {
          id: user.id,
        },
      },
      list: {
        connect: {
          id: interviewing.id,
        },
      },
    },
  ];

  const defaultJobs = await Promise.all(
    jobs.map((job) => db.job.create({ data: job }))
  );
}

seed();
