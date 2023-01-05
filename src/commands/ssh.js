import SSH from "../lib/ssh.js"
import { logger } from "../utils.js";


export default function (parentCommand) {
  return parentCommand
    .command(
      "forwardOut",
      "Forward local connections to port on the server",
      (yargs) => {
        return yargs
          .option("localPort", {
            alias: "lp",
            description: "local port",
          })
          .option("remotePort", {
            alias: "rp",
            description: "destination port",
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);
        try {
          const ssh = new SSH(argv)
          await ssh.connect();
          ssh.forwardOut(argv)
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
    .command(
      "forwardIn",
      "Forward local connections to port on the server",
      (yargs) => {
        return yargs
          .option("localPort", {
            alias: "lp",
            description: "local port",
          })
          .option("remotePort", {
            alias: "rp",
            description: "destination port",
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);
        try {
          const ssh = new SSH(argv)
          await ssh.connect();
          ssh.forwardIn(argv)
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
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
          const ssh = new SSH(argv)
          await ssh.connect();
          const completed = await ssh.nodeSSH.getDirectory(
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
          const ssh = new SSH(argv)
          await ssh.connect();
          const completed = await ssh.nodeSSH.putDirectory(
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
          const ssh = new SSH(argv)
          await ssh.connect();
          await ssh.nodeSSH.getFile(argv.localFilePath, argv.remoteFilePath);
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
          const ssh = new SSH(argv)
          await ssh.connect();
          await ssh.nodeSSH.putFiles([
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
          const ssh = new SSH(argv)
          await ssh.connect();
          const result = await ssh.nodeSSH.execCommand(argv.cmd, {});
          if (result.stdout) console.log(result.stdout);
          if (result.stderr) console.log(result.stderr);
          process.exit(0);
        } catch (error) {
          console.error("ERROR:", error.message);
          logger(argv.verbose)(error.stack);
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
