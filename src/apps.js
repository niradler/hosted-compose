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
    console.log({ fn, args, options });
    return compose[fn](...args, options);
  }

  async runCompose({ name, fn, args }, options = {}) {
    try {
      const appDir = this.appPath(name);
      await this.execCompose(fn, args, {
        ...options,
        cwd: appDir,
        log: true,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  appPath(name) {
    return Path.join(toFilePath(this.rootDir), name);
  }

  async create({ name, config, env }) {
    const appDir = this.appPath(name);
    await fs.mkdir(appDir, { recursive: true });
    const fileName = "docker-compose.json";
    await fs.writeFile(
      Path.join(appDir, fileName),
      JSON.stringify(config, null, 2)
    );
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
