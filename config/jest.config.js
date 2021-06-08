const ignore_arr = ["(<rootDir>/)(?=(node_modules|build|public))", "<rootDir>/src/utils/Tree.ts"];
const testMatch = ["<rootDir>/tests/" + process.argv[process.argv.length - 1] + "/**/*.ts?(x)"];

module.exports = {
  rootDir: "../",
  preset: "ts-jest",
  moduleNameMapper: { "\\.(jpg|jpeg|png|gif|css|scss)$": "<rootDir>/tests/__mocks__/emptyMock.ts" },
  moduleFileExtensions: ["js", "ts", "tsx"],
  testMatch,
  testPathIgnorePatterns: ignore_arr,
  coveragePathIgnorePatterns: ignore_arr,
  setupFiles: [
    "<rootDir>/tests/__mocks__/reducerValueMock.ts",
    "<rootDir>/tests/__mocks__/cryptoKeyMock.ts",
    "<rootDir>/tests/__mocks__/subtleMock.ts"
  ],
  restoreMocks: true,
  verbose: true,
  coverageThreshold: { global: { statements: 50, branches: 50, functions: 50, lines: 50 } }
};
