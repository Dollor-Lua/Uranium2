const { join } = require("path");
const { existsSync } = require("fs");

module.exports = async (command) => {
    if (existsSync(join(__dirname, "../commands/", command + ".js"))) {
        return command;
    }

    const shorthands = require("../commands/shorthand.command.json");

    if (shorthands[command]) {
        return shorthands[command];
    }

    if (existsSync(join(process.cwd(), "package.json"))) {
        const pkgjs = require(join(process.cwd(), "package.json"));
        const scripts = pkgjs["scripts"] || {};

        if (scripts[command] != null) {
            return ["run", command];
        }
    }

    return null;
};
