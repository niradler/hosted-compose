#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import inquirer from "inquirer";
import Apps from "./src/apps.js";

async function getEnv() {
  const ans = await inquirer.prompt([
    {
      name: "env",
      type: "confirm",
      message: "Configure environment variables?",
    },
  ]);
  const env = {};
  if (ans.env) {
    let hasMore = true;
    do {
      const { key, value, more } = await inquirer.prompt([
        {
          name: "key",
          type: "input",
          message: "Environment variables key:",
        },
        {
          name: "value",
          type: "input",
          message: "Environment variables value:",
        },
        {
          name: "more",
          type: "confirm",
          message: "Add More?",
        },
      ]);
      env[key] = value;
      hasMore = more;
    } while (hasMore);
  }

  return env;
}

yargs(hideBin(process.argv))
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.runCompose({
        name: argv.name,
        fn: "logs",
        args: [],
      });
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.runCompose({
        name: argv.name,
        fn: "ps",
        args: [],
      });
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.runCompose({
        name: argv.name,
        fn: "down",
        args: [],
      });
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.runCompose({
        name: argv.name,
        fn: "up",
        args: [],
      });
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.runCompose({
        name: argv.name,
        fn: "restartAll",
        args: [],
      });
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.runCompose({
        name: argv.name,
        fn: "run",
        args: [argv.service, argv.cmd],
      });
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.runCompose({
        name: argv.name,
        fn: "stop",
        args: [],
      });
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.exec(argv);
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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      await apps.runCompose({
        name: argv.name,
        fn: "stop",
        args: [],
      });
      await apps.runCompose({
        name: argv.name,
        fn: "pull",
        args: [],
      });
      await apps.runCompose(
        {
          name: argv.name,
          fn: "up",
          args: [],
        },
        {
          composeOptions: ["--force-recreate"],
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
      if (argv.verbose) console.debug(argv);

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
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);

      const { config } = await inquirer.prompt([
        {
          name: "config",
          type: "editor",
          message: "docker compose config",
        },
      ]);

      await apps.create({
        config: Apps.parseConfig(config, argv.configType),
        name: argv.name,
        env: await getEnv(),
      });
    }
  )
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .parse();
