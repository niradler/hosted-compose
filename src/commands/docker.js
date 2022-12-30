import fs from "fs-extra";
import Docker from "../lib/docker.js";
import { toFilePath, sshConfiguration, logger } from "../utils.js";

export default function (parentCommand) {
  parentCommand
    .command(
      "ps",
      "list containers",
      (yargs) => {
        return yargs.option("test", {
          description: "test",
        });
      },
      async (argv) => {
        logger(argv.verbose)(argv);
        try {
          let sshConfig, privateKey;
          if (argv.protocol === "ssh") {
            const config = await sshConfiguration(argv);
            logger(argv.verbose)(config);
            sshConfig = config;
          }
          const {
            privateKeyPath,
            port,
            host,
            username,
            password,
            passphrase,
            cert,
            ca,
            key,
            protocol,
          } = sshConfig ? sshConfig : argv;
          if (privateKeyPath) {
            privateKey = await fs.readFile(
              toFilePath(sshConfig.privateKeyPath),
              "ascii"
            );
          }
          logger(argv.verbose)({
            port,
            host,
            username,
            password,
            passphrase,
            cert,
            ca,
            key,
            protocol,
            privateKeyPath,
            privateKey,
          });
          const docker = new Docker({
            privateKey,
            port,
            host,
            username,
            password,
            passphrase,
            cert,
            ca,
            key,
            protocol,
          });
          const containers = await docker.execFn("listContainers");
          console.log(JSON.stringify(containers, null, 2));
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
    .option("host", {
      description: "host",
    })
    .option("socketPath", {
      description: "socketPath",
    })
    .option("port", {
      description: "port",
    })
    .option("cert", {
      description: "cert",
    })
    .option("ca", {
      description: "ca",
    })
    .option("key", {
      description: "key",
    })
    .option("privateKeyPath", {
      description: "ssh private key path",
    })
    .option("protocol", {
      description: "protocol",
    })
    .option("config", {
      default: ".ssh/config",
      description: "use config file to pull configuration (~/.ssh/config)",
    });
}
