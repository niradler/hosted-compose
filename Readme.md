# self hosted app management

easy way to manage your self hosted server base on docker and docker-compose.

## Usage

```sh
npm i -g self-hosted-app-compose
```

create your first app:

```sh
app-compose create --name mongo --root-dir ./apps
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
app-compose remove --name mongo --root-dir ./apps
```

for the complete command list:

```sh
app-compose --help
```
