import updateCaretPosition from "./updateCaretPosition.js";
import generateObjects from "./generateObjects.js";
import guiUpdater from "./guiUpdater.js";

class editor {
    main = null;
    lineNumber = null;
    cursor = null;

    line = 0;
    column = 0;
    tlines = 1;

    focused = false;

    lines = [""];
    empties = [0];

    constructor(editor) {
        const objects = generateObjects(editor);
        this.main = objects[0];
        this.lineNumber = objects[1];
        this.cursor = objects[2];

        this.line = 0;
        this.column = -1;
        this.tlines = 1;

        let self = this;

        function getFocused() {
            return self.focused;
        }

        function setFocused(set) {
            self.focused = set;
        }

        document.onclick = function (e) {
            self.focused = false;
        };

        this.main.onclick = function (e) {
            e.stopPropagation();
            if (("button" in e && e.button != 2) || ("which" in e && e.which != 3)) {
                setFocused(true);
                updateCaretPosition(self, objects[0], e, "LeftMouseButton", true, window.getSelection().focusOffset);
            }
        };

        this.main.oncontextmenu = function (e) {
            // show popup of tools next to mouse
        };

        document.onkeydown = function (e) {
            if (["Arrow", "Page", "Home", "End"].some((type) => !e.key.startsWith(type))) {
                if (getFocused()) updateCaretPosition(self, self.main, e, e.key, true);
            }
        };

        document.onkeyup = (e) => {
            if (["Arrow", "Page", "Home", "End"].some((type) => e.key.startsWith(type))) {
                if (getFocused()) updateCaretPosition(self, self.main, e, e.key, false);
            }
        };
    }

    fixIndicators() {
        if (this.column < -1) {
            this.line--;
            if (this.line < 0) {
                this.line = 0;
                this.column = -1;
            } else {
                this.column = this.lines[this.line].length - 1;
            }
        }

        if (this.line < 0) {
            this.line = 0;
            this.column = -1;
        }

        if (this.line > this.lines.length - 1) {
            this.line = this.lines.length - 1;
            this.column = this.lines[this.line].length - 1;
        }

        if (this.column > this.lines[this.line].length - 1) {
            this.column = this.lines[this.line].length - 1;
        }

        if (this.column < -1) this.column = -1;
    }

    async type(key) {
        const self = this;
        this.lines[this.line] = this.lines[this.line].splice(this.column + 1, 0, key);
        if (this.empties.includes(this.line)) {
            const index = this.empties.indexOf(this.line);
            if (index !== -1) {
                this.empties.splice(index, 1);
            }
        }

        self.column++;

        return self.lines[self.line];
    }

    async newline(totalAfter) {
        if (this.lines.length > totalAfter) return;
        this.lines.splice(this.line + 1, 0, "");
        this.empties.push(this.line + 1);

        this.column = -1;

        this.tlines++;
        this.line++;

        return this.lines[this.line - 1];
    }

    async backspace() {
        this.lines[this.line] = this.lines[this.line].splice(this.column, 1, "");
        this.column--;

        if (this.column < -1 && this.line != 0) {
            if (this.empties.includes(this.line)) {
                if (this.empties.indexOf(this.line) !== -1) {
                    this.empties.splice(this.empties.indexOf(this.line), 1);
                }
            }

            this.lines.splice(this.line, 1);
            this.line--;
            this.tlines--;
            this.column = this.lines[this.line].length - 1;
        }

        if (this.lines[this.line].length == 0) {
            if (!this.empties.includes(this.line)) {
                this.empties.push(this.line);
                this.column = -1;
            }
        }

        this.line++;
        return this.lines[this.line];
    }
}

export default editor;
