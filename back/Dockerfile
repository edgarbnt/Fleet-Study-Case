FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY tsconfig.json ./
COPY src ./src

RUN npm i -D typescript && npx tsc

RUN rm -rf src && npm prune --omit=dev

RUN mkdir -p /data
VOLUME ["/data"]

ENV NODE_ENV=production
ENV BACKEND_PORT=4000
ENV DATABASE_FILE=/data/app.sqlite

EXPOSE 4000

CMD ["node", "dist/index.js"]