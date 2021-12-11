const EventEmitter = require("events").EventEmitter;

const { BasicLogger } = require("./logger");

class Display extends BasicLogger {
    #colors = {
        DEFAULT: "\x1b[0m",

        BLACK: "\x1b[30m",
        RED: "\x1b[31m",
        GREEN: "\x1b[32m",
        YELLOW: "\x1b[33m",
        BLUE: "\x1b[34m",
        PURPLE: "\x1b[35m",
        CYAN: "\x1b[36m",
        LIGHTGREY: "\x1b[37m",

        DARKGREY: "\x1b[1;30m",
        PERSIMMON: "\x1b[1;31m",
        LIME: "\x1b[1;32m",
        LIGHTYELLOW: "\x1b[1;33m",
        MIDBLUE: "\x1b[1;34m",
        PINK: "\x1b[1;35m",
        TOOTHPASTE: "\x1b[1;36m",
        WHITE: "\x1b[1;37m",
    };

    #enabled = true;
    #queue = false;

    #current_queue = [];

    constructor() {
        super();
    }

    colorcode(str, color) {
        if (this.#colors[color]) {
            return this.#colors[color] + str + this.#colors["DEFAULT"];
        }

        return str;
    }

    getColorTable() {
        return this.#colors;
    }

    colourcode(str, colour) {
        return this.colorcode(str, colour);
    }

    getColourTable() {
        return getColorTable();
    }

    queue(args) {
        if (typeof args === "string") {
            this.#current_queue.push(args);
        } else {
            for (var i = 0; i < args.length; i++) {
                this.#current_queue.push(args);
            }
        }

        return true;
    }

    log(args) {
        if (typeof args === "string") {
            if (this.#enabled) console.log(args);
            else if (this.#queue) this.#current_queue.push(args);
        } else {
            for (var i = 0; i < args.length; i++) {
                if (this.#enabled) console.log(args[i]);
                else if (this.#queue) this.#current_queue.push(args[i]);
            }
        }
    }

    queueColor(text, color) {
        this.#current_queue.push(this.colorcode(text, color));
        return true;
    }

    logColor(text, color) {
        if (this.#enabled) console.log(this.colorcode(text, color));
        else if (this.#queue) this.#current_queue.push(this.colorcode(text, color));
    }
}

module.exports.Display = Display;
