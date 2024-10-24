FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:18 AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

RUN npm prune --production

# Ensure the /usr/src/app/data directory is created
RUN mkdir -p /usr/src/app/data

EXPOSE 3000

CMD ["node", "server.js"]
