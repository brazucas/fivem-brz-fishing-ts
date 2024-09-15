const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testRegex: "(/test/.*|(\\.|/)(test))\\.(ts|js)$",
  testPathIgnorePatterns: [],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["**/*.ts"],
  modulePathIgnorePatterns: [],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
};
