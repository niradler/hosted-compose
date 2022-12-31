import Path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import os from "os";
import SSHConfig from "ssh-config";
import { readdir } from "fs/promises";

export const toFilePath = (path, root = process.cwd()) => {
  if (!path) return;
  return Path.isAbsolute(path) ? path : Path.join(root, path);
};

export const fileExists = async (path) => {
  return !!(await fs.stat(path).catch((e) => false));
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getEnv = async () => {
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
};

export const isWin = process.platform === "win32";

const secureAccess = (value) => (value ? value : {});

export const sshConfiguration = async (argv) => {
  try {
    const config = SSHConfig.parse(
      await fs.readFile(Path.join(os.homedir(), argv.config), "ascii")
    );
    const hostConfig = config.find((c) => c.value === argv.host);
    if (!hostConfig) throw new Error("Host configuration not found");

    return {
      ...argv,
      host: secureAccess(hostConfig.config.find((c) => c.param === "HostName"))
        .value,
      username: secureAccess(hostConfig.config.find((c) => c.param === "User"))
        .value,
      privateKeyPath: secureAccess(
        hostConfig.config.find((c) => c.param === "IdentityFile")
      ).value,
      port: secureAccess(hostConfig.config.find((c) => c.param === "Port"))
        .value,
    };
  } catch (error) {
    logger(argv.verbose)("ssh parse config error:", error.message);
  }

  return argv;
};

export const logger = (verbose = false) => {
  return (...args) => {
    if (verbose) console.log("[Logger]", ...args);
  };
};

export const getDirectories = async (root) =>
  (await readdir(root, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
