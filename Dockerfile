# Stage 1: Cài đặt dependencies
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Thay vì apk add của Alpine, ta dùng apt-get của Debian để cài openssl (cần cho Prisma)
RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Build mã nguồn
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fake DB URL để Prisma vượt qua bước generate code
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner (Môi trường chạy thực tế)
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g prisma@6 tsx typescript

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY LẠI ĐẦY ĐỦ NODE_MODULES VÀ .NEXT ĐỂ CHẠY
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

COPY --from=builder --chown=nextjs:nodejs /app/src ./src

USER nextjs

EXPOSE 3000
ENV PORT 3000

# SỬ DỤNG 'npm run start'
CMD ["sh", "-c", "until prisma db push --skip-generate --accept-data-loss; do echo 'Đang chờ Database khởi động...'; sleep 3; done && (tsx prisma/seed.ts || echo 'Seed hoàn tất') && npm run start"]