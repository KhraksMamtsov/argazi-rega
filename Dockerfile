FROM node:20-alpine as dependencies
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/app
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma
COPY tsconfig*.json ./
RUN corepack enable && corepack use pnpm@8
RUN pnpm install --frozen-lockfile

FROM node:20-alpine as builder
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/app
COPY --from=dependencies /usr/app ./
COPY . .
COPY prisma/ ./prisma/
COPY tsconfig*.json ./
RUN npm run all:build

FROM node:20-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/app
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/build ./build
COPY prisma ./prisma
COPY package*.json ./
CMD ["node", "build/esm/src/index.js"]