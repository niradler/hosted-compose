import Apps from "./apps.js";
import { Docker, socketPath } from "./docker.js";

const apps = new Apps({});
const config = {
  version: "3.4",
  services: {
    mongo_container: {
      container_name: "mongo_service",
      image: "mongo",
      labels: [
        "homepage.show=true",
        "homepage.description=my description",
        "homepage.title=mongo",
        "homepage.link=test.com",
      ],
      env_file: [".env"],
      ports: ["3201:27017"],
    },
  },
};
await apps.create({
  name: "mongo1",
  config,
  env: {
    NODE_ENV: "production",
    MY_TEST: "teststr1",
  },
});

const docker = new Docker({ socketPath });
const con = await docker.listContainers();
console.log(con);

await apps.remove({
  name: "mongo1",
});
