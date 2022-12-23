FROM node:lts-alpine

RUN apk add --no-cache alpine-sdk python3 py3-pip make g++

WORKDIR /usr/src/app

USER root

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .

ENTRYPOINT ["node", "cli.js"]

