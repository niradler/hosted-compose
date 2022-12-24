import Path from "path";
import fs from "fs-extra";

export const toFilePath = (path, root = process.cwd()) => {
  if (!path) return;
  return Path.isAbsolute(path) ? path : Path.join(root, path);
};

export const fileExists = async (path) =>
  !!(await fs.stat(path).catch((e) => false));
