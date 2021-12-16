const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};

walk(path.join(__dirname, "../src/"), async function (err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
        const tres = path.normalize(res[i].split("\\\\").join("\\"));
        const tresi = tres.split("src").join("inc");

        if (res[i].substr(res[i].length - 3) != ".js") {
            console.log("Skipped: " + tresi);
            if (!fs.existsSync(path.dirname(tresi))) {
                await fs.promises.mkdir(path.dirname(tresi), { recursive: true });
            }

            const data = await fs.promises.readFile(tres);
            await fs.promises.writeFile(tresi, data);
            continue;
        }

        if (!fs.existsSync(path.dirname(tresi))) {
            await fs.promises.mkdir(path.dirname(tresi), { recursive: true });
        }

        await new Promise((resolve, _reject) => {
            var proc;
            if (process.platform === "win32") {
                proc = child_process.spawn("npx.cmd", ["uglify-js", `${tres}`, "--compress", "-o", `${tresi}`], {
                    cwd: process.cwd(),
                    stdio: "inherit",
                });
            } else {
                proc = child_process.spawn("npx", ["uglify-js", `${tres}`, "--compress", "-o", `${tresi}`], {
                    cwd: process.cwd(),
                    stdio: "inherit",
                });
            }
            proc.on("exit", function () {
                console.log("Resolved: " + res[i].split("src").join("inc").split("\\\\").join("\\"));
                resolve();
            });
        });
    }
});
