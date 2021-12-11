const EventEmitter = require("events");

const { BasicLogger } = require("./util/logger");
const { Display } = require("./util/display");
const { Timers } = require("./util/timers");
const commexists = require("./util/command_exists");

const pkg = require("./package.json");

class TK extends EventEmitter {
    static get version() {
        return pkg.version;
    }

    #logger = null;
    #display = null;
    #timers = null;
    #process = null;

    errormsg = `\tat UraniumTK.js (${__filename})\n\t\x1b[1;30mat TKCLI.js (UTK:Core/UraniumTK/TKCLI.js)\n\tat console in ? cin (UTK:Pred:Core/console.read)\x1b[0m`;

    constructor(proc) {
        super();

        this.command = null;
        this.#logger = new BasicLogger();
        this.#display = new Display();
        this.#timers = new Timers();
        this.#process = proc;

        this.argv = this.#process.argv;
        this.argv.splice(0, 2);

        this.config = { "ignore-non": false }; // no config editing yet :(
    }

    get version() {
        return this.constructor.version;
    }

    deref(cmd) {
        if (!cmd || typeof cmd !== "string") return "";

        if (cmd.match(/[A-Z]/)) {
            cmd = cmd.replace(/([A-Z])/g, (m) => "-" + m.toLowerCase());
        }

        return cmd || "";
    }

    async cmd(cmd) {
        const command = this.deref(cmd);
        if (!command) {
            throw Object.assign(new Error(`Unknown command ${cmd}`), {
                code: "EUNKNOWNCOMMAND",
            });
        }

        const Comm = require(`./commands/${command}.js`);
        const comm = new Comm(this);
        return comm;
    }

    async exec(cmd, args) {
        const exists = await commexists(cmd);
        if (exists == null) {
            this.errormsg = `UTK-COMMEXISTS: Invalid Command\n\t${this.errormsg}`;
            throw Object.assign(
                new Error(
                    `\x1b[31m error \x1b[0m Command "${cmd}" was not found or does not exist.\n\x1b[34m info \x1b[0m To view a list of valid commands run:\n  utk help`
                ),
                { code: "EUNKNOWNCOMMAND" }
            );
        } else if (typeof exists === "string") {
            cmd = exists;
        } else {
            args.unshift(exists[1]);
            cmd = exists[0];
        }

        const command = await this.cmd(cmd);
        process.emit("time", `command:${cmd}`);

        if (!this.command) {
            process.env.current_command = command.name;
            this.command = command.name;
        }

        return command.exec(args).finally(() => {
            process.emit("timeEnd", `command:${cmd}`);
        });
    }

    out(str) {
        this.#logger.log(str);
    }

    what(e) {
        return e.stack + "\n\nwhat(compr):\n" + this.errormsg;
    }
}

module.exports = TK;
