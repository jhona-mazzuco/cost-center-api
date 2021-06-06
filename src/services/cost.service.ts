import { PrismaClient } from '@prisma/client';
import { CostCreate } from '../interfaces/cost-create.interface';
import { Cost } from '../interfaces/cost.interface';
import { CostUpdate } from '../interfaces/cost-update.interface';

const prisma = new PrismaClient();

async function create({ name, value, centerId }: CostCreate): Promise<Cost> {
  return await prisma.cost.create({
    data: {
      name,
      value,
      centerId,
    },
  });
}

async function findById(id: string): Promise<Cost | null> {
  return await prisma.cost.findUnique({
    select: {
      id: true,
      name: true,
      value: true,
    },
    where: {
      id,
    },
  });
}

async function update(id: string, { name, value }: CostUpdate): Promise<Cost> {
  return await prisma.cost.update({
    select: {
      id: true,
      name: true,
      value: true,
    },
    data: {
      name,
      value,
    },
    where: {
      id,
    },
  });
}

async function remove(id: string): Promise<void> {
  await prisma.cost.delete({
    where: {
      id,
    },
  });
}

export default {
  create,
  findById,
  update,
  remove,
};
