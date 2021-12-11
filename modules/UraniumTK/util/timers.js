const EventEmitter = require("events").EventEmitter;

class Timers {
    #start = 0.0;
    #end = 0.0;

    #running = false;
    #before = false;

    onStatusChanged = new EventEmitter();

    constructor(started = false) {
        if (started) this.start();
    }

    getTime(form) {
        if (form == "sec") return new Date().getTime() / 1000;
        else if (form == "mil") return new Date().getTime();
        return false;
    }

    start() {
        if (this.#running || this.#before) return;
        this.onStatusChanged.emit("started");
        this.#start = this.getTime("sec");
        running = true;
        before = true;
    }

    end() {
        if (!this.#running) return;
        this.onStatusChanged.emit("ended");
        this.#end = this.getTime("sec");
        running = false;
    }

    getTimeDifference() {
        if (!this.#running && this.#before) return this.#end - this.#start;
        else return null;
    }

    getTimes() {
        return [this.#start, this.#end];
    }

    formatString(str) {
        if (this.getTimeDifference()) return str.split("%TIME%").join(this.getTimeDifference());
        else return null;
    }
}

module.exports.Timers = Timers;
