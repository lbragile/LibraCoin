// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const args = process.argv;
fs.rename(args[args.length - 2], args[args.length - 1], (err) => {
  if (err) console.error(err);
});
