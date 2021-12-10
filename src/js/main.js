const { Terminal } = require("xterm");
const { WebLinksAddon } = require("xterm-addon-web-links");
const { SerializeAddon } = require("xterm-addon-serialize");
const { Unicode11Addon } = require("xterm-addon-unicode11");
const { SearchAddon } = require("xterm-addon-search");
const { FitAddon } = require("xterm-addon-fit");

const terminal = new Terminal();

// Load all terminal addons
terminal.loadAddon(new WebLinksAddon());
terminal.loadAddon(new SerializeAddon());
terminal.loadAddon(new Unicode11Addon());
terminal.loadAddon(new WebLinksAddon());
terminal.loadAddon(new SearchAddon());
terminal.loadAddon(new FitAddon());

terminal.open(document.getElementById("terminal"));
terminal.writeln("\x1b[32mPAX CI Successfully loaded the console host.\x1b[0m");
