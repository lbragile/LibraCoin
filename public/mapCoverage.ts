/* eslint-disable @typescript-eslint/no-var-requires */
const { createReporter } = require("istanbul-api");
const istanbulCoverage = require("istanbul-lib-coverage");

const map = istanbulCoverage.createCoverageMap();
const reporter = createReporter();

const testTypes = ["unit", "integration"];

testTypes.forEach((testType) => {
  const coverage = require((process.env.GITHUB_WORKFLOW ? "./" : "../") + `coverage/coverage-${testType}-final.json`);
  Object.keys(coverage).forEach((filename) => map.addFileCoverage(coverage[filename]));
});

reporter.addAll(["json", "lcov", "text"]);
reporter.write(map);
