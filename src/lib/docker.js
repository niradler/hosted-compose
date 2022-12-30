import { Docker as DockerImp } from "../sources/docker.js";

export class Docker {
  constructor(options) {
    this.docker = new DockerImp(options);
  }

  async execFn(fn, args = []) {
    return this.docker[fn](...args);
  }
}

export default Docker;
