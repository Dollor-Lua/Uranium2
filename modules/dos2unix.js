const fs = require("fs");
const path = require("path");

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("\x1b[31merror\x1b[0m File path required.");
    console.log("\x1b[34minfo\x1b[0m Ex: dos2unix utk.sh.");
    process.exit(1);
}

const cont = fs.readFileSync(path.join(process.cwd(), args[0]), { encoding: "utf8", flag: "r" });

const unix = cont.split("\r\n").join("\n");

fs.writeFileSync(path.join(process.cwd(), args[0]), unix);

console.log("\x1b[32msuccess\x1b[0m File " + args[0] + " has had their line endings swapped from \\r\\n to \\n.");
