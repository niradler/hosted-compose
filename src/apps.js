import fs from "fs-extra";
import Path from "path";
import YAML from "yaml";
// import compose from "./compose.js";
import compose from "docker-compose";
import { toFilePath } from "./utils.js";

export class Apps {
  constructor({ rootDir, verbose }) {
    this.rootDir = rootDir || process.cwd();
    this.verbose = verbose || false;
  }

  logger(...args) {
    if (this.verbose) console.log("[Logger]", ...args);
  }

  static parseConfig(config, configType = "yaml") {
    switch (configType) {
      case "yaml":
      case "yml":
        return YAML.parse(config);
      case "json":
        return JSON.parse(config);
      default:
        throw new Error("Unsupported config type");
    }
  }

  execCompose(fn, args, options) {
    if (!compose[fn]) throw new Error("Unsupported compose function");
    this.logger({ fn, args, options });
    return new Promise((resolve, reject) => {
      compose[fn](...args, options).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          console.error("Something went wrong", err.message);
          reject(err.message);
        }
      );
    });
  }

  async runCompose({ name, fn, args }, options = {}) {
    const appDir = this.appPath(name);
    await this.execCompose(fn, args, {
      ...options,
      cwd: appDir,
      log: true,
    });
  }

  appPath(name) {
    return Path.join(toFilePath(this.rootDir), name);
  }

  async create({ name, config, configType, env }) {
    const appDir = this.appPath(name);
    await fs.mkdir(appDir, { recursive: true });
    const fileName = `docker-compose.${configType}`;
    await fs.writeFile(Path.join(appDir, fileName), config);
    if (env && Object.keys(env).length > 0) {
      await fs.writeFile(
        Path.join(appDir, ".env"),
        Object.keys(env)
          .map((key) => `${key}=${env[key]}`)
          .join("\n")
      );
    }

    await this.runCompose({
      name,
      fn: "upAll",
      args: [],
    });

    console.log("Created");
  }

  async remove({ name }) {
    const appDir = this.appPath(name);

    await this.runCompose({
      name,
      fn: "down",
      args: [],
    });

    await fs.remove(appDir);
    console.log("Removed");
  }
}

export default Apps;
