/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testPathIgnorePatterns: ["apps/*", "node_modules"],
  moduleNameMapper: {
    "#(.*)": "D:\\Projects\\nodejs\\docker-compose-manager\\node_modules\\$1",
  },
};

module.exports = config;
