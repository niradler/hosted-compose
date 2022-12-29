# hosted-compose

easy way to manage your self hosted server

- docker management (local/remote)
- docker-compose (apps) (local/remote)
- ssh utils
- zx scripts

## Usage

```sh
npm i -g hosted-compose
```

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

for the complete command list:

```sh
hosted-compose --help
```
