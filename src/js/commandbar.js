import langs from "./languages/supported.json.js";
import { compareTwoStrings } from "./stringSimilarity.js";

const cmdbar = document.getElementById("command-bar");
const cmdbarText = document.getElementById("command-bar-main");
const suggestor = document.getElementById("suggestion-container");
const primary = document.getElementById("primary");

var cmdbarMode = "OFF";

function f_updateCommandBar() {
    if (cmdbarMode === "language") {
        var bestOrder = [];
        for (var i = 0; i < langs.length; i++) {
            const n = [langs[i][0], compareTwoStrings(cmdbarText.innerText, langs[i][0])];
            bestOrder.push(n);
        }

        bestOrder.sort((a, b) => {
            return b[1] - a[1];
        });

        suggestor.innerHTML = "";
        for (let i = 0; i < bestOrder.length; i++) {
            const suggestion = document.createElement("div");
            suggestion.innerText = bestOrder[i][0];

            suggestor.appendChild(suggestion);
        }
    } else if (cmdbarMode === "OFF") {
        if (!cmdbar.classList.contains("disabled")) cmdbar.classList.add("disabled");
    }
}

export function showCommandBar(format) {
    if (format === "language") {
        cmdbarMode = "language";
    }

    cmdbarText.innerHTML = "";

    if (cmdbar.classList.contains("disabled")) cmdbar.classList.remove("disabled");
    f_updateCommandBar();
}

cmdbar.onclick = function (e) {
    e.stopPropagation();
};

cmdbar.onkeydown = function (e) {
    if (e.key == "Escape") {
        cmdbarMode = "OFF";
        f_updateCommandBar();
    }
};

primary.onclick = function (e) {
    cmdbarMode = "OFF";
    f_updateCommandBar();
};

cmdbarText.addEventListener("DOMSubtreeModified", f_updateCommandBar);

export const updateCommandBar = f_updateCommandBar;
