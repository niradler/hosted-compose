import fs from "fs-extra";
import Path from "path";
import YAML from "yaml";
import compose from "docker-compose";

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
    return compose[fn](...args, options);
  }

  async runCompose({ name, fn, args }, options = {}) {
    const appDir = Path.join(this.rootDir, name);
    await this.execCompose(fn, args, {
      ...options,
      cwd: appDir,
      log: true,
    });
  }

  async create({ name, config, env }) {
    const appDir = Path.join(this.rootDir, name);
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
    await compose.upAll({
      cwd: appDir,
      log: true,
    });

    console.log("Created");
  }

  async remove({ name }) {
    const appDir = Path.join(this.rootDir, name);

    await compose.down({
      cwd: appDir,
      log: true,
    });

    await fs.remove(appDir);
    console.log("Removed");
  }

  async exec({ name, container, cmd }) {
    const appDir = Path.join(this.rootDir, name);
    await compose.exec(container, cmd, {
      cwd: appDir,
      log: true,
    });
  }

  async logs({ name, service, cmd }) {
    const appDir = Path.join(this.rootDir, name);
    await compose.exec(service, cmd, {
      cwd: appDir,
      log: true,
    });
  }
}

export default Apps;
