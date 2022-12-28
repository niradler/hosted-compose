import Docker from "dockerode";
import { isWin } from "../utils.js";
let socketPath = isWin ? "//./pipe/docker_engine" : "/var/run/docker.sock";
socketPath = process.env.DOCKER_SOCKET_PATH || socketPath;

export { socketPath, Docker };
