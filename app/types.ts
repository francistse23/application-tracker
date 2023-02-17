import { Prisma } from "@prisma/client";

const job = Prisma.validator<Prisma.JobArgs>()({
  select: {
    id: true,
    company: true,
    description: true,
    title: true,
    url: true,
    listId: true,
    createdAt: true,
    updatedAt: true,
  },
});

const list = Prisma.validator<Prisma.ListArgs>()({
  select: {
    id: true,
    name: true,
  },
});

export type Job = Prisma.JobGetPayload<typeof job>;
export type List = Prisma.ListGetPayload<typeof list>;
