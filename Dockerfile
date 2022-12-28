FROM node:lts

COPY --from=library/docker:latest /usr/local/bin/docker /usr/bin/docker
COPY --from=docker/compose:latest /usr/local/bin/docker-compose /usr/bin/docker-compose

WORKDIR /usr/src/app

USER root

RUN apt-get update && apt-get upgrade -y 

RUN apt-get install -y python3 python3-pip

RUN pip3 install docker-compose
RUN docker-compose --version

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .

ENTRYPOINT ["node", "cli.js"]

