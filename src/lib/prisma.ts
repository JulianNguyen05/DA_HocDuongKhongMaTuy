import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Khai báo kiểu global để giữ instance Prisma không bị mất khi Hot-Reload
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Nếu đang ở Production, tạo mới 1 lần. Nếu ở Dev, dùng lại instance cũ.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;