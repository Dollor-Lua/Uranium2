const EventEmitter = require("events").EventEmitter;

class BasicLogger {
    #enabled = true;
    #queue = false;

    #current_queue = [];

    onStatusChanged = new EventEmitter();

    constructor({ enabled = true, queue = false } = {}) {
        this.#enabled = enabled;
        this.#queue = queue;

        if (enabled) this.on();
        else this.off();
    }

    flush(max = 0) {
        if (max > 0) {
            for (var i = 0; i < max; i++) {
                console.log(this.#current_queue[0]);
                this.#current_queue.shift();
            }
        } else {
            for (var i = 0; i < this.#current_queue.length; i++) {
                console.log(this.#current_queue[i]);
            }

            this.#current_queue = [];
        }

        return true;
    }

    on() {
        this.onStatusChanged.emit("enabled");
        this.flush();
    }

    off(clear = true) {
        this.onStatusChanged.emit("disabled");
        if (clear) this.#current_queue = [];
    }

    queue(args) {
        if (typeof args === "string") {
            this.#current_queue.push(args);
        } else {
            for (var i = 0; i < args.length; i++) {
                this.#current_queue.push(args);
            }
        }

        this.onStatusChanged.emit("queued");
        return true;
    }

    ison() {
        return this.#enabled;
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

        if (this.#enabled) this.onStatusChanged.emit("logFinish");
        else this.onStatusChanged.emit("queued");
    }
}

module.exports.BasicLogger = BasicLogger;
