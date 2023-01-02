# Docker

```sh
hosted-compose docker

Manage docker

Commands:
  hosted-compose docker sdk  run dockerode sdk command, see
                             github.com/apocas/dockerode
  hosted-compose docker ps   list containers

Options:
      --help            Show help                                      [boolean]
      --version         Show version number                            [boolean]
  -v, --verbose         Run with verbose logging                       [boolean]
      --host            host
      --socketPath      socketPath
      --port            port
      --cert            cert
      --ca              ca
      --key             key
      --privateKeyPath  ssh private key path
      --protocol        protocol
      --config          use ssh config file to pull configuration (~/.ssh/config)
                                                        [default: ".ssh/config"]
```

`hosted-compose docker ps` equivalent to `hosted-compose  docker sdk --fn listContainers`

_to see the full sdk function support visit github.com/apocas/dockerode_

run docker command on remote host with ssh `hosted-compose docker sdk --fn listContainers --host myhost --protocol ssh`

_you can pass private key and other configuration as args, but much more recommanded way is to use ssh config for more details read the ssh command docs_
