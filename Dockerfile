FROM node:20-alpine AS deps
WORKDIR /app
# package-lock.json을 함께 복사해 npm ci로 재현 가능한 설치
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# standalone server가 모든 인터페이스에 바인딩되도록 설정
# 기본값(localhost)을 그대로 두면 컨테이너 외부에서 접근 불가
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
