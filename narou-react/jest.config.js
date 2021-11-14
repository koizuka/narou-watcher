module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>src/setupTests.ts"],
  moduleDirectories: ["src", "node_modules"],
};
