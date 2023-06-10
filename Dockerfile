FROM node:alpine as builder

EXPOSE 3000
WORKDIR /app

ADD . .

RUN npm ci && npm run build

CMD ["npm", "run", "start"]
