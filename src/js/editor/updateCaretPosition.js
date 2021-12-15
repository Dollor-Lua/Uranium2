export default async function (self, element, event, key, up, mouser = false) {
    if (!mouser && up) {
        switch (key) {
            case "ArrowRight": {
                self.column++;
                break;
            }
            case "ArrowLeft": {
                self.column--;
                break;
            }
            case "ArrowUp": {
                self.line--;
                break;
            }
            case "ArrowDown": {
                self.line++;
                break;
            }
            case "PageUp": {
                self.line -= 30;
                break;
            }
            case "PageDown": {
                self.line += 30;
                break;
            }
            case "Home": {
                self.column = 0;
                break;
            }
            case "End": {
                self.line++;
                self.column = -1;
                break;
            }
            case "Backspace": {
                await self.backspace();
                break;
            }
            case "Enter": {
                await self.newline();
                break;
            }
            case "LeftMouseButton": {
                // change to mouse position
                break;
            }
            default: {
                if (event.key.length == 1) await self.type(event.key);
                break;
            }
        }
    }

    self.fixIndicators();

    element.innerHTML = "";
    for (let i = 0; i < self.lines.length; i++) {
        if (!self.lines[i]) continue;
        const ln = document.createElement("div");
        ln.innerText = self.lines[i];
        element.appendChild(ln);
    }

    var lt = "1";
    for (let i = 2; i <= element.childNodes.length; i++) {
        lt += "\n" + i;
    }

    document.getElementById("line-number").innerText = lt;
    document.getElementById("line-info").innerText = `Ln ${self.line + 1}, Col ${self.column + 1}`;

    document.getElementById("editor-cursor").style.left = `${(self.column <= 0 ? 2 : 11) + 9.61 * self.column}px`;
    document.getElementById("editor-cursor").style.top = `${18 * self.line}px`;
}
