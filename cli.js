#!/usr/bin/env node

import { fileURLToPath } from "url";
import Path from "path";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import appsCommand from "./src/commands/apps.js";
import sshCommand from "./src/commands/ssh.js";
import dockerCommand from "./src/commands/docker.js";
import scriptsCommand from "./src/commands/scripts.js";
import * as dotenv from "dotenv";
import fs from 'fs-extra';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
global.__basedir = Path.parse(__filename).dir;

yargs(hideBin(process.argv))
  .scriptName("hosted-compose")
  .usage("$0 command")
  .command(
    "version",
    "show version",
    (yargs) => {
      return yargs

    },
    async () => {
      const packageJson = await fs.readJson(Path.join(__basedir, 'package.json'))
      console.log(packageJson.version)
    }
  )
  .command({
    command: "apps",
    description: "Manage docker compose apps",
    builder: (yargs) => appsCommand(yargs).demandCommand(1)
      .strict(),
  })
  .command({
    command: "docker",
    description: "Manage docker",
    builder: (yargs) => dockerCommand(yargs).demandCommand(1)
      .strict(),
  })
  .command({
    command: "ssh",
    description: "SSH integration",
    builder: (yargs) => sshCommand(yargs).demandCommand(1)
      .strict(),
  })
  .command({
    command: "scripts",
    description: "SSH integration",
    builder: (yargs) => scriptsCommand(yargs).demandCommand(1)
      .strict(),
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .demandCommand(1, "")
  .parse();
