import { PrismaClient } from '@prisma/client';
import { Register } from '../interfaces/register.interface';
import { compareSync, hash } from 'bcrypt';
import { Login } from '../interfaces/login.interface';
import { Secret, sign } from 'jsonwebtoken';
import { User } from '../interfaces/user.interface';
import { Token } from '../interfaces/token.interface';

const prisma = new PrismaClient();

async function register({ email, password, name }: Register): Promise<void> {
  const encryptedPassword = await hash(password, 10);
  await prisma.user.create({
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
  const token = sign(user, process.env.JWT_KEY as Secret);
  await prisma.token.create({
    data: {
      token,
      expireAt: new Date().getTime().toString(),
    },
  });

  return { token };
}

async function checkToken(token: string): Promise<boolean> {
  const apiToken = await prisma.token.findFirst({
    where: {
      token,
    },
  });

  if (apiToken && apiToken.expireAt) {
    const expireAt = new Date(Number.parseInt(apiToken.expireAt));
    if (expireAt > new Date()) {
      await prisma.token.delete({
        where: {
          id: apiToken.id,
        },
      });

      return false;
    } else {
      await prisma.token.update({
        data: {
          expireAt: new Date().getTime().toString(),
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

async function logout(token: string): Promise<void> {
  await prisma.token.delete({
    where: {
      token,
    },
  });
}

export default {
  register,
  login,
  generateToken,
  checkToken,
  logout,
};
