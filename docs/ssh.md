# SSH

```sh
hosted-compose ssh

SSH integration

Commands:
  hosted-compose ssh forwardOut    Forward remote port on the server to local port
  hosted-compose ssh forwardIn     Forward local connections to port on the server
  hosted-compose ssh getDirectory  copy folder from destination
  hosted-compose ssh putDirectory  copy folder to destination
  hosted-compose ssh getFile       copy file from destination
  hosted-compose ssh putFile       copy file to destination
  hosted-compose ssh exec          ssh exec

Options:
      --help            Show help                                      [boolean]
      --version         Show version number                            [boolean]
  -v, --verbose         Run with verbose logging                       [boolean]
      --host            ssh host                                      [required]
      --username        ssh username
      --privateKeyPath  private key path
      --passphrase      passphrase
      --password        password
      --config          use config file to pull configuration (~/.ssh/config)
                                                        [default: ".ssh/config"]
      --port            port                                       [default: 22]
```

The key should be ed25519 SSH key, you can generate a key using

```sh
ssh-keygen -t ed25519
```

id_ed25519.pub file should be added to .ssh/authorized_keys on the server side.
id_ed25519 is your private key to connect to the server should be store on the client side.

to reduce the amount of args pass when using ssh, please configure your ssh config and pass `--host myhost`

~/.ssh/config

```
Host myhost
  HostName 1.1.1.1
  User ubuntu
  Port 22
  IdentityFile path\key\id_ed25519
```
