import { showCommandBar } from "./commandbar.js";

const langButton = document.getElementById("choice-lang");

export default function () {
    langButton.onclick = () => showCommandBar("language");
}
