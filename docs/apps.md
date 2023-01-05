# Apps

```sh
hosted-compose apps

Manage docker compose apps

Commands:
  hosted-compose apps ls       list apps
  hosted-compose apps sdk      run docker-compose sdk command, see
                               github.com/PDMLab/docker-compose
  hosted-compose apps all      run on all apps
  hosted-compose apps logs     containers logs
  hosted-compose apps ps       list containers
  hosted-compose apps down     stop containers
  hosted-compose apps up       start containers
  hosted-compose apps restart  restart app
  hosted-compose apps run      run command in a service
  hosted-compose apps stop     stop app
  hosted-compose apps exec     exec command in app service
  hosted-compose apps list     list services
  hosted-compose apps pull     pull app images
  hosted-compose apps upgrade  upgrade app
  hosted-compose apps remove   remove app
  hosted-compose apps create   create app

Options:
      --help                    Show help                              [boolean]
      --version                 Show version number                    [boolean]
  -v, --verbose                 Run with verbose logging               [boolean]
      --rootDir                 apps root directory
                                  [default: "D:\Projects\nodejs\hosted-compose"]
      --commandOptions, --com   compose command options    [array] [default: []]
      --composeOptions, --comp  compose options            [array] [default: []]
```

Base on docker-compose cli, required to be installed.

`hosted-compose apps create --name mongo`

- mkdir mongo in `--rootDir`
- create docker-compose file base on supplied config, can be yml/json
- create config file
- create .env file with environment variables if supplied
- run docker-compose up

_open editor prompt in custom editor EDITOR=nano hosted-compose apps create --name mongo_
_to run on remote host, use docker context_
