const { Display } = require("./util/display");
const commexists = require("./util/command_exists");

module.exports = async (process) => {
    // set process.title here so that whatever happens later we aren't
    // leaking any CLI info to other programs that may be running.
    process.title = "Uranium Toolkit";

    // Create a new toolkit instance so we can use this later.
    // We will mainly use this for running commands, but it also will
    // hold command line arguments (not including node.exe and the execution
    // path/file that's currently running).
    const TK = require("./UraniumTK");
    const tk = new TK(process);

    const log = new Display();

    // TODO:
    // Check for unsupported or broken Node versions.
    // This will allow us to tell the user as soon as possible
    // that they have a broken version to prevent the toolkit from loading
    // up a lot and ending up not needing to use any of it.

    // Create a variable for the default color (\x1b[0m) as it
    // will be used a lot considering that to reset the console's
    // colors back to normal we have to use the default color
    // escape. It will also be useful in the future if we end up using
    // stuff such as bold text, thin text, hidden cursors, etc.
    // Essentially this will reset the text back to normal in all consoles
    // regardless of the previous font configuration specified.
    const DCOL = log.getColorTable()["DEFAULT"];
    if ((await commexists(tk.argv[0].trim())) != "version") {
        log.log(`${log.getColorTable()["CYAN"]} using ${DCOL} Uranium Toolkit v${tk.version}`);
        log.log(`${log.getColorTable()["CYAN"]} using ${DCOL} Node ${process.version}`);
    }

    let cmd;
    let caught = false; // prevent double erroring

    // now we actually need to make the toolkit work.
    // this is how we should **always** load the toolkit via javascript.
    try {
        cmd = tk.argv.shift();
        if (!cmd) {
            log.log(tk.usage(log.getColorTable()));
            process.exitCode = 1;
            process.exit();
        }

        await tk.exec(cmd, tk.argv);
        return true;
    } catch (err) {
        if (!caught) {
            if (err.code === "EUNKNOWNCOMMAND") {
                log.log(`${log.getColorTable()["RED"]} error ${DCOL} Unknown Command: "${cmd}"`);
                log.log(`\nread(1):\n${tk.errormsg.split("\n")[0]}`);
                log.log("To see a lot of supported commands, run:\n  utk help\n");
                caught = true;
                return true;
            } else {
                log.log(`${log.getColorTable()["RED"]} FATAL ${DCOL} ${err} // command: "${cmd}"`);
                log.log(`\nwhat(): ${tk.what(err)}`);
                caught = true;
                return false;
            }
        }
    }
};
