import fs from "fs-extra";
import Docker from "../lib/docker.js";
import { toFilePath, sshConfiguration, logger } from "../utils.js";

const getDockerConfig = async (argv) => {
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
  return {
    sshOptions: {
      privateKey,
      port,
      username,
      password,
      passphrase,
      protocol,
    },
    port,
    username,
    host,
    cert,
    ca,
    key,
    protocol,
  }
}

export default function (parentCommand) {
  return parentCommand
    .command(
      "sdk",
      "run dockerode sdk command, see github.com/apocas/dockerode",
      (yargs) => {
        return yargs.option("function", {
          alias: "fn",
          description: "sdk function",
          required: true,
        }).option("args", {
          description: "function args",
          default: [],
          type: 'array',
        });
      },
      async (argv) => {
        logger(argv.verbose)(argv);
        try {
          const docker = new Docker(await getDockerConfig(argv));
          const res = await docker.execFn(argv.function, argv.args);
          console.log(JSON.stringify(res, null, 2));
          process.exit(0);
        } catch (error) {
          console.error("ERROR:", error.message);
          process.exit(1);
        }
      }
    )
    .command(
      "ps",
      "list containers",
      (yargs) => {
        return yargs
      },
      async (argv) => {
        logger(argv.verbose)(argv);
        try {
          const docker = new Docker(await getDockerConfig(argv));
          const containers = await docker.execFn("listContainers");
          console.log(JSON.stringify(containers, null, 2));
          process.exit(0);
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
