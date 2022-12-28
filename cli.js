#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import appsCommand from "./src/commands/apps.js";
import sshCommand from "./src/commands/ssh.js";
import * as dotenv from "dotenv";
dotenv.config();

yargs(hideBin(process.argv))
  .scriptName("app-compose")
  .usage("$0 command")
  .command({
    command: "apps",
    description: "Manage docker compose apps",
    builder: (yargs) => appsCommand(yargs),
  })
  .command({
    command: "ssh",
    description: "SSH integration",
    builder: (yargs) => sshCommand(yargs),
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .demandCommand(1, "")
  .parse();
