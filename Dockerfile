FROM niradler/project-base
# use ubuntu if not working with alpine
COPY --from=library/docker:latest /usr/local/bin/docker /usr/bin/docker
COPY --from=docker/compose:latest /usr/local/bin/docker-compose /usr/bin/docker-compose

WORKDIR /usr/src/app

USER root
RUN apk update && \
    apk add --no-cache docker-cli python3 && \
    apk add --no-cache --virtual docker-cli python3 python3-dev libffi-dev openssl-dev gcc libc-dev make python3 py3-pip py-pip curl libffi-dev openssl-dev gcc libc-dev rust cargo make && \
    pip3 install docker-compose
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .

ENTRYPOINT ["node", "cli.js"]

