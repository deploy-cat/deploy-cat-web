FROM denoland/deno:alpine

EXPOSE 8080
WORKDIR /app

ADD ./dist .
RUN deno cache server.js

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "server.js"]
