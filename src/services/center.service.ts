import { PrismaClient } from '@prisma/client';
import { Center } from '../interfaces/center.interface';

const prisma = new PrismaClient();

async function create({ name }: Center, userId: string): Promise<Center> {
  return await prisma.center.create({
    data: {
      userId,
      name,
    },
  });
}

async function find(userId: string, query?: string): Promise<Center[] | null> {
  return await prisma.center.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      userId,
      AND: {
        name: {
          contains: query,
        },
      },
    },
  });
}

async function findById(id: string): Promise<Center | null> {
  return await prisma.center.findUnique({
    select: {
      id: true,
      name: true,
      costs: {
        select: {
          id: true,
          name: true,
          value: true,
        },
      },
    },
    where: {
      id,
    },
  });
}

async function update(id: string, name: string): Promise<Center> {
  return await prisma.center.update({
    select: {
      id: true,
      name: true,
    },
    data: {
      name,
    },
    where: {
      id,
    },
  });
}

async function remove(id: string): Promise<void> {
  await prisma.center.delete({
    where: {
      id,
    },
  });
}

export default {
  create,
  find,
  findById,
  update,
  remove,
};
