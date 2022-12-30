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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: argv.composeOptions,
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
            composeOptions: [...argv.composeOptions],
          }
        );
        await apps.runCompose({
          name: argv.name,
          fn: "pullAll",
          args: [],
        });
        await apps.runCompose(
          {
            name: argv.name,
            fn: "upAll",
            args: [],
          },
          {
            composeOptions: [...argv.composeOptions],
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
          composeOptions: argv.composeOptions,
          configType: argv.configType,
          config: config,
          name: argv.name,
          env: await getEnv(),
        });
      }
    )
    .option("composeOptions", {
      alias: "co",
      type: "array",
      default: [],
      description: "compose options",
    });
}
