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
    "apps [action]",
    "manage apps",
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
        })
        .positional("action", {
          describe: "create, remove apps",
          required: true,
        });
    },
    async (argv) => {
      if (argv.verbose) console.debug(argv);

      const apps = new Apps(argv);
      switch (argv.action) {
        case "create":
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
          break;
        case "remove":
          await apps.remove({ name: argv.name });
          break;
        default:
          throw new Error("Unsupported action");
      }
    }
  )
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .parse();
