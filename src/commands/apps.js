import inquirer from "inquirer";
import Apps from "../lib/apps.js";
import { getEnv, logger } from "../utils.js";

export default function (parentCommand) {
  return parentCommand
    .command(
      "ls",
      "list apps",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        logger(argv.verbose)(argv);

        const apps = new Apps(argv);
        await apps.ls();
      }
    )
    .command(
      "sdk",
      "run docker-compose sdk command, see github.com/PDMLab/docker-compose",
      (yargs) => {
        return yargs
          .option("fn", {
            alias: "function",
            required: true,
            description: "function to run",
          })
          .option("args", {
            type: "array",
            default: [],
            description: "function args",
          }).option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        const { verbose, commandOptions, fn, args, composeOptions, name } = argv;
        logger(verbose)(argv);

        const apps = new Apps(argv);
        await apps.runCompose(
          {
            name,
            fn,
            args,
          },
          {
            commandOptions,
            composeOptions,
          }
        );
      }
    )
    .command(
      "all",
      "run on all apps",
      (yargs) => {
        return yargs
          .option("fn", {
            alias: "function",
            required: true,
            description: "function to run",
          })
          .option("args", {
            type: "array",
            default: [],
            description: "function args",
          });
      },
      async (argv) => {
        const { verbose, commandOptions, fn, args, composeOptions } = argv;
        logger(verbose)(argv);

        const apps = new Apps(argv);
        const folders = await apps.ls();
        for (const appName of folders) {
          await apps.runCompose(
            {
              name: appName,
              fn,
              args,
            },
            {
              commandOptions,
              composeOptions,
            }
          );
        }
      }
    )
    .command(
      "logs",
      "containers logs",
      (yargs) => {
        return yargs
          .option("services", {
            type: "array",
            description: "services names",
          })
          .option("follow", {
            alias: "f",
            description: "stream logs",
            type: "boolean",
            default: false
          }).option("name", {
            description: "app name",
            required: true,
          });
      },
      async (argv) => {
        logger(argv.verbose)(argv);
        const apps = new Apps(argv);
        let { services, follow } = argv
        if (!services) {
          const { data } = await apps.runCompose(
            {
              name: argv.name,
              fn: "configServices",
              args: [],
            },
            {
              log: false,
              commandOptions: argv.commandOptions,
            }
          );
          services = data.services
        }
        await apps.runCompose(
          {
            name: argv.name,
            fn: "logs",
            args: [services],
          },
          {
            follow,
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "ps",
      "list containers",
      (yargs) => {
        return yargs.option("name", {
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
        return yargs.option("name", {
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
        return yargs.option("name", {
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
        return yargs.option("name", {
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
            commandOptions: argv.commandOptions,
          }
        );
      }
    )
    .command(
      "run",
      "run command in a service",
      (yargs) => {
        return yargs
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
        return yargs.option("name", {
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
      "exec command in app service",
      (yargs) => {
        return yargs
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
        return yargs.option("name", {
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
        return yargs.option("name", {
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
        return yargs.option("name", {
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
        return yargs.option("name", {
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
    .option("rootDir", {
      default: process.cwd(),
      description: "apps root directory",
    })
    .option("commandOptions", {
      alias: "com",
      type: "array",
      default: [],
      description: "compose command options",
    })
    .option("composeOptions", {
      alias: "comp",
      type: "array",
      default: [],
      description: "compose options",
    });
}
