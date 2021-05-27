import { PrismaClient } from '@prisma/client';
import { Register } from '../interfaces/register.interface';
import { compareSync, hash } from 'bcrypt';
import { Login } from '../interfaces/login.interface';
import { Secret, sign } from 'jsonwebtoken';
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

async function login({ email, password }: Login): Promise<Token | null> {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user?.password && (await compareSync(password, user?.password))) {
    if (!user.active) {
      return null;
    }

    const data = {
      email: user.email,
      name: user.name,
      active: user.active,
    };

    const jwt = sign(data, process.env.JWT_KEY as Secret, { expiresIn: '1h' });

    return { token: jwt };
  }

  return null;
}

export default {
  register,
  login,
};
