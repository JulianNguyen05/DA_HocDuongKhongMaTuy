# Stage 1: Cài đặt dependencies
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Dùng apt-get của Debian để cài openssl (cần cho Prisma)
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

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner (Môi trường chạy thực tế)
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN apt-get update -y && apt-get install -y openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY LẠI ĐẦY ĐỦ THƯ MỤC CẦN THIẾT
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

ENV npm_config_cache=/tmp

USER nextjs

EXPOSE 3000
ENV PORT 3000

# DÙNG npx ĐỂ ĐẢM BẢO QUYỀN TRUY CẬP ĐÚNG, ÉP TẠO BẢNG VÀ NẠP DATA
CMD ["sh", "-c", "until npx prisma db push --accept-data-loss; do echo 'Đang chờ Database khởi động...'; sleep 3; done && npx tsx prisma/seed.ts && npm run start"]