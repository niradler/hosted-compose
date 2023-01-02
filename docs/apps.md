# lib

apps management, using docker-compose package, docker-compose cli installed is needed.

ssh action, the key should be ed25519 SSH key

```sh
ssh-keygen -t ed25519
```

id_ed25519.pub file should be added to .ssh/authorized_keys on the server side.
id_ed25519 is your private key to connect to the server should be store on the client side.
