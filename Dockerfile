FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:18 AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

RUN npm prune --production

VOLUME ["/app/data"]

EXPOSE 3000

CMD ["node", "server.js"]
