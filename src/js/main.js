import editor from "./editor/generator.js";
import { updateSplice } from "./randutil.js";
import defaultButtonManager from "./defaultButtonManager.js";

updateSplice();

var term = new Terminal();

// apply terminal addons
term.loadAddon(new WebLinksAddon.WebLinksAddon());
term.loadAddon(new SerializeAddon.SerializeAddon());
term.loadAddon(new Unicode11Addon.Unicode11Addon());
term.loadAddon(new SearchAddon.SearchAddon());
term.loadAddon(new FitAddon.FitAddon());

term.open(document.getElementById("terminal"));
window.uranium.onTermData((e, data) => {
    term.write(data);
});

term.onData((e) => {
    window.uranium.sendTermKeystroke(e);
});

var edt = new editor(document.getElementById("editor"));
window.edt = edt;

defaultButtonManager();
