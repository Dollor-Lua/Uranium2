const child_process = require("child_process");
const { existsSync } = require("fs");
const { join } = require("path");

const truescripts = ["publish", "install", "uninstall", "test", "stop", "start", "restart", "version"];

class run {
    #version = "1.1.3";
    #tk = null;

    constructor(tk) {
        this.#tk = tk;
    }

    async exec(args) {
        this.#tk.out(`\x1b[1mUranium Toolkit run v${this.#version}\x1b[0m`);
        this.#tk.errormsg = `\tat run.js (${__filename})\n` + this.#tk.errormsg;
        if (args.length > 0) {
            return this.run(args);
        }
    }

    async run(args) {
        const self = this;
        if (!existsSync(join(process.cwd(), "package.json"))) {
            this.#tk.errormsg = `No package.json file was found\n\t${this.#tk.errormsg}`;
            throw Object.assign(
                new Error(
                    `\x1b[31m error \x1b[0m No package.json file was found.\n\x1b[34m info \x1b[0m Make sure that you  are in the correct directory and that the package.json exists.`
                ),
                { code: "ENOPACKAGE" }
            );
        }

        const pkg = require(join(process.cwd(), "package.json"));
        const { scripts } = pkg;
        pkg.scripts = scripts;

        const torun = args.shift();
        if (!scripts[torun] && !Object.prototype.hasOwnProperty(scripts, torun)) {
            const keys = Object.keys(scripts);
            this.#tk.errormsg = `Invalid Command\n\t${this.#tk.errormsg}`;
            throw Object.assign(
                new Error(
                    `\x1b[31m error \x1b[0m Command "${torun}" was not found or does not exist.\n\x1b[34m info \x1b[0m View the package.json inside your working directory for commands.`
                ),
                { code: "EUNKNOWNCOMMAND" }
            );
        }

        if (this.#tk.config["ignore-non"]) {
            if (!truescripts.includes(torun)) {
                this.#tk.errormsg = `Invalid possible command\n\t${this.#tk.errormsg}`;
                throw new Error(
                    `\x1b[31m error \x1b[0m Command "${torun}" is not true to npm basis. Disable option 'ignore-non' to use these commands.\n\x1b[34m info \x1b[0m View the package.json inside modules/UraniumTK/ for commands.`
                );
            }
        }

        const Impl = scripts[torun];
        const impl = Impl.split("&&");

        for (var i = 0; i < impl.length; i++) {
            self.#tk.out("\x1b[1;30m$ " + impl[i] + "\x1b[0m\n");

            const ci = i;
            var argus = impl[ci].split(" ");

            argus.shift();
            argus = argus.join(" ");

            // attempt to run an executable first, if it doesn't exist then go to npx.
            var c;
            c = child_process.spawn(impl[ci].split(" ")[0], argus.split(" "), { cwd: process.cwd() });
            c.on("error", function (_e) {
                var aa = child_process.exec(impl[ci], function (e, stdout, stderr) {
                    if (e) {
                        var c2;
                        // TODO: Replace npx with a custom javascript file that searches node_modules
                        if (process.platform === "win32") {
                            c2 = child_process.spawn("npx.cmd", impl[ci].split(" "), { cwd: process.cwd(), stdio: "inherit" });
                        } else {
                            c2 = child_process.spawn("npx", impl[ci].split(" "), { cwd: process.cwd(), stdio: "inherit" });
                        }

                        c2.on("error", function (e2) {
                            throw e2;
                        });
                    } else {
                        if (stdout) console.log(stdout);
                        else console.log(stderr);
                    }
                });
            });
        }
    }
}

module.exports = run;
