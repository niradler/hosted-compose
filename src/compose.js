import childProcess from "child_process";
import yaml from "yaml";
import mapPorts from "./map-ports.js";
const nonEmptyString = (v) => v !== "";
export const mapPsOutput = (output, options) => {
  let isQuiet = false;
  if (
    options === null || options === void 0 ? void 0 : options.commandOptions
  ) {
    isQuiet =
      options.commandOptions.includes("-q") ||
      options.commandOptions.includes("--quiet") ||
      options.commandOptions.includes("--services");
  }
  const services = output
    .split(`\n`)
    .filter(nonEmptyString)
    .filter((_, index) => isQuiet || index > 1)
    .map((line) => {
      let nameFragment = line;
      let commandFragment = "";
      let stateFragment = "";
      let untypedPortsFragment = "";
      if (!isQuiet) {
        [nameFragment, commandFragment, stateFragment, untypedPortsFragment] =
          line.split(/\s{3,}/);
      }
      return {
        name: nameFragment.trim(),
        command: commandFragment.trim(),
        state: stateFragment.trim(),
        ports: mapPorts(untypedPortsFragment.trim()),
      };
    });
  return { services };
};
/**
 * Converts supplied yml files to cli arguments
 * https://docs.docker.com/compose/reference/overview/#use--f-to-specify-name-and-path-of-one-or-more-compose-files
 */
const configToArgs = (config) => {
  if (typeof config === "undefined") {
    return [];
  } else if (typeof config === "string") {
    return ["-f", config];
  } else if (config instanceof Array) {
    return config.reduce((args, item) => args.concat(["-f", item]), []);
  }
  throw new Error(`Invalid argument supplied: ${config}`);
};
/**
 * Converts docker-compose commandline options to cli arguments
 */
const composeOptionsToArgs = (composeOptions) => {
  let composeArgs = [];
  composeOptions.forEach((option) => {
    if (option instanceof Array) {
      composeArgs = composeArgs.concat(option);
    }
    if (typeof option === "string") {
      composeArgs = composeArgs.concat([option]);
    }
  });
  return composeArgs;
};
/**
 * Executes docker-compose command with common options
 */
export const execCompose = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const composeOptions = options.composeOptions || [];
    const commandOptions = options.commandOptions || [];
    let composeArgs = composeOptionsToArgs(composeOptions);
    const isConfigProvidedAsString = !!options.configAsString;
    const configArgs = isConfigProvidedAsString
      ? ["-f", "-"]
      : configToArgs(options.config);
    composeArgs = composeArgs.concat(
      configArgs.concat(
        [command].concat(composeOptionsToArgs(commandOptions), args)
      )
    );
    const cwd = options.cwd;
    const env = options.env || undefined;
    const executablePath = options.executablePath || "docker-compose";
    const childProc = childProcess.spawn(executablePath, composeArgs, {
      cwd,
      env,
    });
    childProc.on("error", (err) => {
      reject(err);
    });
    const result = {
      exitCode: null,
      err: "",
      out: "",
    };
    childProc.stdout.on("data", (chunk) => {
      var _a;
      result.out += chunk.toString();
      (_a = options.callback) === null || _a === void 0
        ? void 0
        : _a.call(options, chunk, "stdout");
    });
    childProc.stderr.on("data", (chunk) => {
      var _a;
      result.err += chunk.toString();
      (_a = options.callback) === null || _a === void 0
        ? void 0
        : _a.call(options, chunk, "stderr");
    });
    childProc.on("exit", (exitCode) => {
      result.exitCode = exitCode;
      if (exitCode === 0) {
        resolve(result);
      } else {
        reject(result);
      }
    });
    if (isConfigProvidedAsString) {
      childProc.stdin.write(options.configAsString);
      childProc.stdin.end();
    }
    if (options.log) {
      childProc.stdout.pipe(process.stdout);
      childProc.stderr.pipe(process.stderr);
    }
  });
/**
 * Determines whether or not to use the default non-interactive flag -d for up commands
 */
const shouldUseDefaultNonInteractiveFlag = function (options = {}) {
  const commandOptions = options.commandOptions || [];
  const containsOtherNonInteractiveFlag = commandOptions.reduce(
    (memo, item) => {
      return (
        memo &&
        !item.includes("--abort-on-container-exit") &&
        !item.includes("--no-start")
      );
    },
    true
  );
  return containsOtherNonInteractiveFlag;
};
export const upAll = function (options) {
  const args = shouldUseDefaultNonInteractiveFlag(options) ? ["-d"] : [];
  return execCompose("up", args, options);
};
export const upMany = function (services, options) {
  const args = shouldUseDefaultNonInteractiveFlag(options)
    ? ["-d"].concat(services)
    : services;
  return execCompose("up", args, options);
};
export const upOne = function (service, options) {
  const args = shouldUseDefaultNonInteractiveFlag(options)
    ? ["-d", service]
    : [service];
  return execCompose("up", args, options);
};
export const down = function (options) {
  return execCompose("down", [], options);
};
export const stop = function (options) {
  return execCompose("stop", [], options);
};
export const stopOne = function (service, options) {
  return execCompose("stop", [service], options);
};
export const stopMany = function (options, ...services) {
  return execCompose("stop", [...services], options);
};
export const pauseOne = function (service, options) {
  return execCompose("pause", [service], options);
};
export const unpauseOne = function (service, options) {
  return execCompose("unpause", [service], options);
};
export const kill = function (options) {
  return execCompose("kill", [], options);
};
export const rm = function (options, ...services) {
  return execCompose("rm", ["-f", ...services], options);
};
export const exec = function (container, command, options) {
  const args = Array.isArray(command) ? command : command.split(/\s+/);
  return execCompose("exec", ["-T", container].concat(args), options);
};
export const run = function (container, command, options) {
  const args = Array.isArray(command) ? command : command.split(/\s+/);
  return execCompose("run", ["-T", container].concat(args), options);
};
export const buildAll = function (options = {}) {
  return execCompose("build", options.parallel ? ["--parallel"] : [], options);
};
export const buildMany = function (services, options = {}) {
  return execCompose(
    "build",
    options.parallel ? ["--parallel"].concat(services) : services,
    options
  );
};
export const buildOne = function (service, options) {
  return execCompose("build", [service], options);
};
export const pullAll = function (options = {}) {
  return execCompose("pull", [], options);
};
export const pullMany = function (services, options = {}) {
  return execCompose("pull", services, options);
};
export const pullOne = function (service, options) {
  return execCompose("pull", [service], options);
};
export const config = async function (options) {
  try {
    const result = await execCompose("config", [], options);
    const config = yaml.parse(result.out);
    return Object.assign(Object.assign({}, result), { data: { config } });
  } catch (error) {
    return Promise.reject(error);
  }
};
export const configServices = async function (options) {
  try {
    const result = await execCompose("config", ["--services"], options);
    const services = result.out.split("\n").filter(nonEmptyString);
    return Object.assign(Object.assign({}, result), { data: { services } });
  } catch (error) {
    return Promise.reject(error);
  }
};
export const configVolumes = async function (options) {
  try {
    const result = await execCompose("config", ["--volumes"], options);
    const volumes = result.out.split("\n").filter(nonEmptyString);
    return Object.assign(Object.assign({}, result), { data: { volumes } });
  } catch (error) {
    return Promise.reject(error);
  }
};
export const ps = async function (options) {
  try {
    const result = await execCompose("ps", [], options);
    const data = mapPsOutput(result.out, options);
    return Object.assign(Object.assign({}, result), { data });
  } catch (error) {
    return Promise.reject(error);
  }
};
export const push = function (options = {}) {
  return execCompose(
    "push",
    options.ignorePushFailures ? ["--ignore-push-failures"] : [],
    options
  );
};
export const restartAll = function (options) {
  return execCompose("restart", [], options);
};
export const restartMany = function (services, options) {
  return execCompose("restart", services, options);
};
export const restartOne = function (service, options) {
  return restartMany([service], options);
};
export const logs = function (services, options = {}) {
  let args = Array.isArray(services) ? services : [services];
  if (options.follow) {
    args = ["--follow", ...args];
  }
  return execCompose("logs", args, options);
};
export const port = async function (service, containerPort, options) {
  const args = [service, containerPort];
  try {
    const result = await execCompose("port", args, options);
    const [address, port] = result.out.split(":");
    return Object.assign(Object.assign({}, result), {
      data: {
        address,
        port: Number(port),
      },
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
export const version = async function (options) {
  try {
    const result = await execCompose("version", ["--short"], options);
    const version = result.out.replace("\n", "").trim();
    return Object.assign(Object.assign({}, result), { data: { version } });
  } catch (error) {
    return Promise.reject(error);
  }
};
export default {
  upAll,
  upMany,
  upOne,
  down,
  stop,
  stopOne,
  pauseOne,
  unpauseOne,
  kill,
  rm,
  exec,
  run,
  buildAll,
  buildMany,
  buildOne,
  pullAll,
  pullMany,
  pullOne,
  config,
  configServices,
  configVolumes,
  ps,
  push,
  restartAll,
  restartMany,
  restartOne,
  logs,
  port,
  version,
};
