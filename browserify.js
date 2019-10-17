#!/usr/bin/env node
"use strict";
const fs = require("fs");
const spawn = require("cross-spawn").spawn;

main();

function execute(binary, args) {
  const result = spawn.sync(`node_modules/.bin/${binary}`, args);
  if (result.status !== 0) {
    process.exit(result.status);
  }
}

function browserify(input, output) {
  execute("browserify", [input, "-o", output]);

  const original = fs.readFileSync(input).toString();
  const library = original.match(/require\(['"]([^'"]+)['"]\);/i)[1];
  const generated = `var polyfilledpkg;${
    fs.readFileSync(output)
      .toString()
      .replace(original, `polyfilledpkg = require("${library}");`)
  }module.exports = polyfilledpkg;`;
  fs.writeFileSync(output, generated);

  execute("uglifyjs", [output, "-o", output, "-m"]);
}

function main() {
  const outputs = "src/browserify";
  const inputs = `${outputs}/packages`;
  for (const file of fs.readdirSync(inputs)) {
    if (!file.endsWith(".js")) {
      continue;
    }
    browserify(`${inputs}/${file}`, `${outputs}/${file}`);
  }
}
