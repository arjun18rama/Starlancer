FROM node:bookworm-slim
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.10.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY . .

CMD ["pnpm", "start"]
