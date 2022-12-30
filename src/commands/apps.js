import inquirer from "inquirer";
import Apps from "../lib/apps.js";
import { getEnv, logger } from "../utils.js";

export default function (parentCommand) {
  parentCommand
    .command(
      "logs",
      "stop containers",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("services", {
            type: "array",
            description: "services names",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "logs",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "ps",
      "list containers",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "ps",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "down",
      "stop containers",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "down",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "up",
      "start containers",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "upAll",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "restart",
      "restart app",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })

          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "restartAll",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "run",
      "run command",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("service", {
            description: "service name",
            required: true,
          })
          .option("cmd", {
            description: "command to run",
            required: true,
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "run",
            args: [argv.service, argv.cmd],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "stop",
      "stop app",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "stop",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "exec",
      "manage apps",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          })
          .option("service", {
            description: "service name",
            required: true,
          })
          .option("cmd", {
            description: "command to run",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "exec",
            args: [argv.service, argv.cmd],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "list",
      "list services",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);

        await apps.runCompose(
          {
            name: argv.name,
            fn: "configServices",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "pull",
      "pull app images",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);

        await apps.runCompose(
          {
            name: argv.name,
            fn: "pullAll",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "upgrade",
      "upgrade app",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name: argv.name,
            fn: "down",
            args: [],
          },
          {
            commandOptions: [["--rmi", "all"], ...argv.commandOptions],
          }
        );
        await apps.runCompose(
          {
            name: argv.name,
            fn: "upAll",
            args: [],
          },
          {
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "remove",
      "remove app",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.remove(argv);
      }
    )
    .command(
      "create",
      "create app",
      (yargs) => {
        return yargs
          .option("rootDir", {
            default: process.cwd(),
            description: "apps root directory",
          })
          .option("configType", {
            default: "yaml",
            description: "yaml/yml/json",
          })
          .option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);

        const { config } = await inquirer.prompt([
          {
            name: "config",
            type: "editor",
            message: "docker compose config",
          },
        ]);

        await apps.create({
          commandOptions: argv.commandOptions,
          configType: argv.configType,
          config: config,
          name: argv.name,
          env: await getEnv(),
        });
      }
    )
    .option("commandOptions", {
      alias: "co",
      type: "array",
      default: [],
      description: "compose command options",
    });
}
