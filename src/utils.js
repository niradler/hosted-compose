import Path from "path";
import fs from "fs-extra";

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
