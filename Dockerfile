FROM niradler/project-base

WORKDIR /usr/src/app

USER root

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .

ENTRYPOINT ["node", "cli.js"]

