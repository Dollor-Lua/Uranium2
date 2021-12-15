const { contextBridge, ipcRenderer } = require("electron");

const termCallbacks = [];

contextBridge.exposeInMainWorld("uranium", {
    close: () => ipcRenderer.send("close"),
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),

    onTermData: (callback) => {
        termCallbacks.push(callback);
    },

    sendTermKeystroke: (data) => ipcRenderer.send("terminal.keystroke", data),
});

ipcRenderer.on("terminal.incomingData", (event, data) => {
    for (let i = 0; i < termCallbacks.length; i++) {
        termCallbacks[i](event, data);
    }
});
