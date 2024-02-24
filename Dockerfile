FROM node:alpine as builder

EXPOSE 3000
WORKDIR /app

ADD . .

RUN npm ci\
    && npx prisma generate\
    && npm run build

# ENTRYPOINT "./entrypoint.sh"
CMD ["./entrypoint.sh"]
