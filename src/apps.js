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

  async create({ name, config, env }) {
    const appDir = Path.join(this.rootDir, name);
    await fs.mkdir(appDir, { recursive: true });
    await fs.writeFile(
      Path.join(appDir, "docker-compose.json"),
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
    await compose
      .upAll({
        cwd: appDir,
        log: true,
      })
      .then(
        () => {
          console.log("Created");
        },
        (err) => {
          console.log("something went wrong:", err.message);
        }
      );
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
}

export default Apps;
