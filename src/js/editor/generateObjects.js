export default function (editor) {
    const mainContainer = document.createElement("div");
    mainContainer.style.overflow = "auto";
    mainContainer.style.overflowY = "hidden";
    mainContainer.style.height = "100%";
    mainContainer.style.minHeight = "20px";
    mainContainer.style.paddingLeft = "3px";
    mainContainer.style.fontFamily = '"Courier New", monospace';
    mainContainer.style.outline = "none";
    mainContainer.style.border = "none";
    mainContainer.style.display = "block";
    mainContainer.style.position = "relative";
    mainContainer.id = "main-editor-container";

    const main = document.createElement("div");
    main.style.overflow = "hidden";
    main.style.height = "100%";
    main.style.minHeight = "20px";
    main.style.width = "calc(100% - 5px)";
    main.style.paddingLeft = "3px";
    main.style.fontFamily = '"Courier New", monospace';
    main.style.display = "block";
    main.style.position = "absolute";
    main.style.top = "0px";
    main.style.left = "0px";
    main.id = "main-editor";

    const lineNumber = document.createElement("div");
    lineNumber.style.width = "fit-content";
    lineNumber.style.minWidth = "25px";
    lineNumber.style.height = "fit-content";
    lineNumber.style.position = "relative";
    lineNumber.style.float = "left";
    lineNumber.style.fontFamily = '"Courier New", monospace';
    lineNumber.style.textAlign = "right";
    lineNumber.style.borderRight = "1px dashed #333";
    lineNumber.style.paddingRight = "5px";
    lineNumber.innerText = "1";
    lineNumber.id = "line-number";

    const cursor = document.createElement("div");
    cursor.style.width = "2px";
    cursor.style.height = "20px";
    cursor.style.backgroundColor = "#fff";
    cursor.style.position = "relative";
    cursor.id = "editor-cursor";

    mainContainer.appendChild(cursor);
    mainContainer.appendChild(main);
    editor.appendChild(lineNumber);
    editor.appendChild(mainContainer);

    return [main, lineNumber, cursor];
}
