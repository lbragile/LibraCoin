const ignore_arr = ["(<rootDir>/)(?=(node_modules|build|public))"];

module.exports = {
  rootDir: "../",
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|css)$": "<rootDir>/tests/__mocks__/emptyMock.ts"
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
  testPathIgnorePatterns: ignore_arr,
  coveragePathIgnorePatterns: ignore_arr,
  setupFiles: ["<rootDir>/tests/__mocks__/reducerValueMock.ts"],
  verbose: true,
  coverageThreshold: { global: { statements: 50, branches: 50, functions: 50, lines: 50 } }
};
