export default function (text) {
    const lines = text.split("\n");
    const plines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = document.createElement("div");
        const cline = lines[i];

        var previndex = -1;
        var index = cline.indexOf("<");
        while (index !== -1) {
            var cindex = index + 1;

            var inQuotes = false;

            var row = cline.substr(0, index);
            var rowtype = "excess";

            function generateDiv() {
                const d = document.createElement("div");
                d.classList.add(rowtype);
                d.innerText = row;
                row = "";
                rowtype = "";
                line.appendChild(d);
            }

            while (true) {
                if (cline.charAt(cindex) == '"') {
                    inQuotes = !inQuotes;
                    if (rowtype != "string" && rowtype != "") {
                        generateDiv();
                    } else {
                        rowtype = "string";
                        row += cline.charAt(cindex);
                    }
                } else if (cline.charAt(cindex) == ">" && !inQuotes) {
                    if (rowtype != "excess" && rowtype != "") {
                        generateDiv();
                    }

                    rowtype = "excess";
                    row = ">"
                    break;
                } else if (cline.charAt(cindex).search(/\w/g) != -1 && !inQuotes) {
                    if (rowtype != "keyword" && rowtype != "") {
                        generateDiv();
                    }

                    rowtype = 
                }
            }

            previndex = cindex;
        }

        plines.appendChild(line);
    }
}
