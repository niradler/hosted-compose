# hosted-compose

hosted-compose is a command-line tool for managing common server tasks, using Docker Compose applications and Docker on remote and local hosts.

## Features

- Manage Docker Compose applications with the apps command
- Manage Docker with the docker command
- SSH integration with the ssh command
- Custom script integration with the scripts command

### Installation

```sh
npm i -g hosted-compose
```

To get started, you can view the available commands by running: `hosted-compose --help`

### Usage

create your first app:

```sh
hosted-compose apps create --name mongo --root-dir ./apps
```

example config:

```sh
version: "3.4"

services:
  mongo_container:
    container_name: mongo_service
    image: mongo
    labels:
      - homepage.show=true
    environment:
      NODE_ENV: production
    ports:
      - 3201:27017
```

remove app:

```sh
hosted-compose apps remove --name mongo --root-dir ./apps
```

_visit the docs folder for more information_
