import os from "os";
import Path from "path";
import fs from "fs/promises";
import { NodeSSH } from "node-ssh";
import { toFilePath } from "../utils.js";
import SSHConfig from "ssh-config";
const ssh = new NodeSSH();

const secureAccess = (value) => (value ? value : {});

const sshConfiguration = async (argv) => {
  try {
    const config = SSHConfig.parse(
      await fs.readFile(Path.join(os.homedir(), argv.config), "ascii")
    );
    const hostConfig = config.find((c) => c.value === argv.host);
    if (!hostConfig) throw new Error("Host configuration not found");

    return {
      ...argv,
      host: secureAccess(hostConfig.config.find((c) => c.param === "HostName"))
        .value,
      username: secureAccess(hostConfig.config.find((c) => c.param === "User"))
        .value,
      privateKeyPath: secureAccess(
        hostConfig.config.find((c) => c.param === "IdentityFile")
      ).value,
      port: secureAccess(hostConfig.config.find((c) => c.param === "Port"))
        .value,
    };
  } catch (error) {
    if (argv.verbose) console.error("ssh parse config error:", error.message);
  }

  return argv;
};

const connect = async (argv) => {
  const config = await sshConfiguration(argv);
  if (argv.verbose) console.log(config);
  let { privateKeyPath, port, host, username, password, passphrase } = config;
  let privateKey;
  if (privateKeyPath) {
    privateKey = await fs.readFile(toFilePath(privateKeyPath), "ascii");
  }
  await ssh.connect({
    port,
    host,
    username,
    privateKey,
    password,
    passphrase,
  });
  if (argv.verbose) console.log("connected");
};

export default function (parentCommand) {
  parentCommand
    .command(
      "getFile",
      "copy file from destination",
      (yargs) => {
        return yargs
          .option("localFilePath", {
            alias: "to",
            description: "local file path",
          })
          .option("remoteFilePath", {
            alias: "from",
            description: "destination file path",
          });
      },
      async (argv) => {
        if (argv.verbose) console.debug(argv);
        try {
          await connect(argv);
          await ssh.getFile(argv.localFilePath, argv.remoteFilePath);
          process.exit(0);
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
    .command(
      "putFile",
      "copy file to destination",
      (yargs) => {
        return yargs
          .option("localFilePath", {
            alias: "from",
            description: "local file path",
          })
          .option("remoteFilePath", {
            alias: "to",
            description: "destination file path",
          });
      },
      async (argv) => {
        if (argv.verbose) console.debug(argv);
        try {
          await connect(argv);
          await ssh.putFiles([
            { local: argv.localFilePath, remote: argv.remoteFilePath },
          ]);
          process.exit(0);
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
    .command(
      "exec",
      "ssh exec",
      (yargs) => {
        return yargs.option("cmd", {
          description: "command to run",
        });
      },
      async (argv) => {
        if (argv.verbose) console.debug(argv);
        try {
          await connect(argv);
          const result = await ssh.execCommand(argv.cmd, {});
          if (result.stdout) console.log(result.stdout);
          if (result.stderr) console.log(result.stderr);
          process.exit(0);
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
    .option("host", {
      required: true,
      description: "ssh host",
    })
    .option("username", {
      description: "ssh username",
    })
    .option("privateKeyPath", {
      description: "private key path",
    })
    .option("passphrase", {
      description: "passphrase",
    })
    .option("password", {
      description: "password",
    })
    .option("config", {
      default: ".ssh/config",
      description: "use config file to pull configuration (~/.ssh/config)",
    })
    .option("port", {
      default: 22,
      description: "port",
    });
}
