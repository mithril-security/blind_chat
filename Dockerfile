# syntax=docker/dockerfile:1
# read the doc: https://huggingface.co/docs/hub/spaces-sdks-docker
# you will also find guides on how best to write your Dockerfile
FROM node:19 AS builder-production

WORKDIR /app

COPY --link --chown=1000 package-lock.json package.json ./
RUN --mount=type=cache,target=/app/.npm \
        npm set cache /app/.npm && \
        npm ci --omit=dev

FROM builder-production AS builder

RUN --mount=type=cache,target=/app/.npm \
        npm set cache /app/.npm && \
        npm ci

COPY --link --chown=1000 . .

#RUN --mount=type=secret,id=DOTENV_LOCAL,dst=.env.local \
RUN npm run build

FROM node:19-slim AS test

RUN npm install -g pm2

COPY --from=builder-production /app/node_modules /app/node_modules
COPY --link --chown=1000 package.json /app/package.json
COPY --from=builder /app/build /app/build

CMD ["pm2", "start", "/app/build/index.js", "-i", "$CPU_CORES", "--no-daemon"]
