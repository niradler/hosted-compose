import fs from "fs/promises";
import { NodeSSH } from "node-ssh";
import { toFilePath, sshConfiguration, logger } from "../utils.js";

const ssh = new NodeSSH();

const connect = async (argv) => {
  const config = await sshConfiguration(argv);
  logger(argv.verbose)(config);
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
  logger(argv.verbose)("connected");
};

export default function (parentCommand) {
  return parentCommand
    .command(
      "getDirectory",
      "copy folder from destination",
      (yargs) => {
        return yargs
          .option("localPath", {
            alias: "to",
            description: "local folder path",
          })
          .option("remotePath", {
            alias: "from",
            description: "destination folder path",
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);
        try {
          await connect(argv);
          const completed = await ssh.getDirectory(
            argv.localPath,
            argv.remotePath
          );
          if (completed) console.log("Completed");
          process.exit(0);
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
    .command(
      "putDirectory",
      "copy folder to destination",
      (yargs) => {
        return yargs
          .option("localPath", {
            alias: "to",
            description: "local folder path",
          })
          .option("remotePath", {
            alias: "from",
            description: "destination folder path",
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);
        try {
          await connect(argv);
          const completed = await ssh.putDirectory(
            argv.localPath,
            argv.remotePath
          );
          if (completed) console.log("Completed");
          process.exit(0);
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
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
        logger(argv.verbose)(argv);
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
        logger(argv.verbose)(argv);
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
        logger(argv.verbose)(argv);
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
