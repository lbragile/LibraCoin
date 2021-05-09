const ignore_arr = ["(<rootDir>/)(?=(node_modules|build|public))"];

module.exports = {
  rootDir: "../",
  roots: "tests/",
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/tests/__mocks__/styleMock.js"
  },
  moduleFileExtensions: ["js, ts, tsx"],
  testPathIgnorePatterns: ignore_arr,
  coveragePathIgnorePatterns: ignore_arr,
  verbose: true,
  coverageThreshold: { global: { statements: 50, branches: 50, functions: 50, lines: 50 } }
};
