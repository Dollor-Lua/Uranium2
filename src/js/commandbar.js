import langs from "./languages/supported.json";

const cmdbar = document.getElementById("command-bar");
const cmdbarText = document.getElementById("command-bar-main");

var cmdbarMode = "OFF";

function updateCommandBar() {
    if (cmdbarMode === "language") {
        var bestOrder = [];
        for (var i = 0; i < langs.length; i++) {
            const n = [
                langs[i],
                stringSimilarity.compareTwoStrings(
                    cmdbarText.innerText,
                    langs[i]
                ),
            ];
            bestOrder.push(n);
        }

        bestOrder.sort((a, b) => {});
    }
}

export function showCommandBar(format) {
    if (format === "language") {
        cmdbarMode = "language";
    }

    if (cmdbar.classList.contains("disabled"))
        cmdbar.classList.remove("disabled");
}

export const updateCommandBar = updateCommandBar;
