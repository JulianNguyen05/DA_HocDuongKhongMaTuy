import { PrismaClient } from '@prisma/client';

// Khởi tạo Prisma Client (Dùng chung cho toàn bộ dự án để tránh đầy bộ nhớ)
const prisma = new PrismaClient();

export default prisma;