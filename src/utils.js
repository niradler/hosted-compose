import Path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";

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
