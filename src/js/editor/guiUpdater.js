export default function (self, element) {
    self.fixIndicators();

    element.innerHTML = "";
    for (let i = 0; i < self.lines.length; i++) {
        if (self.lines[i] == undefined && self.lines[i] != "") continue;
        const ln = document.createElement("div");
        ln.innerText = self.lines[i];

        if (self.lines[i].trim() == "" || self.empties.includes(i)) {
            ln.innerHTML = "<br>";
        }

        element.appendChild(ln);
    }

    var lt = "1";
    for (let i = 2; i <= self.tlines; i++) {
        lt += "\n" + i;
    }

    document.getElementById("line-number").innerText = lt;
    document.getElementById("line-info").innerText = `Ln ${self.line + 1}, Col ${self.column + 2}`;

    document.getElementById("editor-cursor").style.left = `${9.61 * (self.column + 1)}px`;
    document.getElementById("editor-cursor").style.top = `${18 * self.line}px`;
}
