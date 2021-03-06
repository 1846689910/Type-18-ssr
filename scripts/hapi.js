"use strict";

const shell = require("shelljs");

process.env.FORCE_COLOR = true;

if (!process.argv.includes("--skip-build")) {
  shell.exec("npm run build");
}

if (process.argv.includes("--touch")) process.env.touch = true;
shell.exec("node src/server hapi");
