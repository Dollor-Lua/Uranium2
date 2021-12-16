import guiUpdater from "./guiUpdater.js";

export default async function (self, element, event, key, up, mouser = false, updater = false) {
    const clength = self ? self.lines.length : null;
    if (!mouser && up && !updater) {
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
                await self.newline(clength + 1);
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

    guiUpdater(self, element);
}
