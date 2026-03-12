# Stage 1: Cài đặt dependencies và thư viện lõi
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm install

# Stage 2: Build mã nguồn
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fake DB URL để Prisma vượt qua bước generate code
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner (Môi trường chạy thực tế - Gọn nhẹ, bảo mật)
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update -y && apt-get install -y openssl

# Cấu hình bảo mật non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy các file tĩnh và file đã build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Chuyển quyền sử dụng cho user bảo mật
USER nextjs

EXPOSE 3000
ENV PORT=3000

# Chỉ khởi chạy server ứng dụng
CMD ["node", "server.js"]