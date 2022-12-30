import fs from "fs-extra";
import Path from "path";
import YAML from "yaml";
import compose from "docker-compose";
import { toFilePath, fileExists, logger } from "../utils.js";

export class Apps {
  constructor({ rootDir, verbose }) {
    this.rootDir = rootDir || process.cwd();
    this.verbose = verbose || false;
  }

  logger = logger(this.verbose);

  static parseConfig(config, configType = "yml") {
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

  execCompose(fn, args = [], options) {
    if (!compose[fn]) throw new Error("Unsupported compose function");
    this.logger("execCompose", { fn, args, options });
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
    this.logger("runCompose", { name, fn, args }, options);
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

  async create({
    name,
    config,
    configType,
    commandOptions,
    composeOptions,
    env,
  }) {
    const appDir = this.appPath(name);

    await fs.mkdir(appDir, { recursive: true });
    this.logger("app folder created", appDir);
    const fileName = `docker-compose.${configType}`;
    const composeFilePath = Path.join(appDir, fileName);
    const hasCompose = await fileExists(composeFilePath);
    if (hasCompose) throw new Error("Already exists: compose file");
    await fs.writeFile(composeFilePath, config);
    this.logger("docker-compose file created", fileName);

    if (env && Object.keys(env).length > 0) {
      const envFilePath = Path.join(appDir, ".env");
      const hasEnv = await fileExists(envFilePath);
      if (hasEnv) throw new Error("Already exists: env file");

      await fs.writeFile(
        envFilePath,
        Object.keys(env)
          .map((key) => `${key}=${env[key]}`)
          .join("\n")
      );
      this.logger(".env file created", env);
    }

    await fs.writeFile(
      Path.join(appDir, "config.json"),
      JSON.stringify(
        {
          name,
          config,
          configType,
          composeOptions,
          commandOptions,
          env,
          appDir,
          composeFile: fileName,
        },
        null,
        2
      )
    );

    await this.runCompose(
      {
        name,
        fn: "upAll",
        args: [],
      },
      {
        commandOptions: [...commandOptions],
      }
    );

    console.log("Created");
  }

  async remove({ name, commandOptions }) {
    const appDir = this.appPath(name);

    await this.runCompose(
      {
        name,
        fn: "down",
        args: [],
      },
      {
        commandOptions: [["--rmi", "all"], ...commandOptions],
      }
    );

    await fs.remove(appDir);
    console.log("Removed");
  }
}

export default Apps;
