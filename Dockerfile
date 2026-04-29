# syntax=docker/dockerfile:1.7

# --- Stage 1: install all workspace deps ---
FROM oven/bun:alpine AS deps
WORKDIR /app

# Native build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package.json bun.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN bun install --frozen-lockfile

# --- Stage 2: build the client ---
FROM deps AS client-builder
WORKDIR /app

COPY shared ./shared
COPY client ./client

WORKDIR /app/client
# routeTree.gen.ts is gitignored; generate it before tsc runs
RUN bunx --bun @tanstack/router-cli generate
RUN bun run build

# --- Stage 3: generate prisma client ---
FROM deps AS prisma-generator
WORKDIR /app

COPY server ./server
COPY shared ./shared

WORKDIR /app/server
# Env vars are required by env.ts schema; dummies suffice for `prisma generate`
RUN SUPERTOKENS_CONNECTION_URI=http://placeholder:3567 bun prisma generate

# --- Stage 4: runtime ---
FROM oven/bun:alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Native build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package.json bun.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN bun install --frozen-lockfile --production

COPY shared ./shared
COPY server ./server

# Prisma generated client (from generator stage)
COPY --from=prisma-generator /app/server/generated ./server/generated

# Built client (server.ts resolves it via path.resolve(__dirname, "../client/dist"))
COPY --from=client-builder /app/client/dist ./client/dist

WORKDIR /app/server
EXPOSE 3001
CMD ["sh", "-c", "bun prisma migrate deploy && exec bun run server.ts"]
