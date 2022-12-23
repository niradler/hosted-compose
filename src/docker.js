import Docker from "dockerode";
const isWin = process.platform === "win32";
let socketPath = isWin ? "//./pipe/docker_engine" : "/var/run/docker.sock";
socketPath = process.env.DOCKER_SOCKET_PATH || socketPath;

export { socketPath, Docker };
