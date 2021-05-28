import { PrismaClient } from '@prisma/client';
import { Register } from '../interfaces/register.interface';
import { compareSync, hash } from 'bcrypt';
import { Login } from '../interfaces/login.interface';
import { decode, Secret, sign } from 'jsonwebtoken';
import { User } from '../interfaces/user.interface';
import { Token } from '../interfaces/token.interface';

const EXPIRATION_TIME = 3600000;
const prisma = new PrismaClient();

async function register({ email, password, name }: Register): Promise<User> {
  const encryptedPassword = await hash(password, 10);
  return await prisma.user.create({
    select: {
      id: true,
      name: true,
      email: true,
    },
    data: {
      email,
      name,
      password: encryptedPassword,
      active: true,
    },
  });
}

async function login({ email, password }: Login): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user?.password && (await compareSync(password, user?.password))) {
    if (!user.active) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
  return null;
}

async function generateToken(user: User): Promise<Token> {
  const oldToken = await prisma.token.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (oldToken) {
    await prisma.token.delete({
      where: {
        id: oldToken.id,
      },
    });
  }

  const token = sign(user, process.env.JWT_KEY as Secret);
  return await prisma.token.create({
    select: {
      token: true,
    },
    data: {
      token,
      expireAt: `${new Date().getTime() + EXPIRATION_TIME}`,
      userId: user.id ?? '',
    },
  });
}

async function checkToken(token: string): Promise<boolean> {
  const apiToken = await prisma.token.findFirst({
    where: {
      token,
    },
  });

  if (apiToken && apiToken.expireAt) {
    const expireAt = new Date(Number.parseInt(apiToken.expireAt));
    if (new Date() > expireAt) {
      await prisma.token.delete({
        where: {
          id: apiToken.id,
        },
      });

      return false;
    } else {
      await prisma.token.update({
        data: {
          expireAt: `${new Date().getTime() + EXPIRATION_TIME}`,
        },
        where: {
          id: apiToken.id,
        },
      });

      return true;
    }
  }

  return false;
}

async function logout(userId: string): Promise<void> {
  await prisma.token.delete({
    where: {
      userId,
    },
  });
}

function getTokenData(token: string): User {
  return decode(token) as User;
}

export default {
  register,
  login,
  logout,
  generateToken,
  checkToken,
  getTokenData,
};
