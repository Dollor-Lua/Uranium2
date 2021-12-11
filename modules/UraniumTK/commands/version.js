const pkg = require("../package.json");

class version {
    #tk = null;

    constructor(tk) {
        this.#tk = tk;
    }

    async exec(_args) {
        this.#tk.errormsg = `at version.js (${__filename})\n\t` + this.#tk.errormsg;
        this.#tk.out(`v${pkg.version}`);
        return true;
    }
}

module.exports = version;
