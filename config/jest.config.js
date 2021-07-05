const ignore_arr = ["(<rootDir>/)(?=(node_modules|build|public))", "<rootDir>/src/utils/Tree.ts"];

module.exports = {
  rootDir: "../",
  preset: "ts-jest",
  moduleNameMapper: { "\\.(jpg|jpeg|png|gif|css|scss)$": "<rootDir>/tests/__mocks__/emptyMock.ts" },
  moduleFileExtensions: ["js", "ts", "tsx"],
  testPathIgnorePatterns: ignore_arr,
  coveragePathIgnorePatterns: ignore_arr,
  setupFiles: [], // environment (.env) specific setup
  setupFilesAfterEnv: [
    "<rootDir>/tests/__mocks__/reducerValueMock.ts",
    "<rootDir>/tests/__mocks__/cryptoKeyMock.ts",
    "<rootDir>/tests/__mocks__/subtleMock.ts",
    "@testing-library/jest-dom",
    "jest-styled-components"
  ], // test specific setup
  runner: "groups", // since jest-runner-groups is used
  restoreMocks: true, // restore mock state before each state
  verbose: true,
  coverageThreshold: { global: { statements: 50, branches: 50, functions: 50, lines: 50 } }
};
