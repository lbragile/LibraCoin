module.exports = {
  target: "web",
  mode: "production",
  entry: "./dist/index.js",
  output: { filename: "../dist/bundle.js" },
  externals: { crypto: require("crypto") },
};
