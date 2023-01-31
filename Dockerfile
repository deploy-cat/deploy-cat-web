FROM node:alpine as builder

ADD . .

RUN npm ci && npm run build


FROM denoland/deno:alpine

EXPOSE 8080
WORKDIR /app

COPY --from=builder ./dist .
RUN deno cache server.js

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "server.js"]
