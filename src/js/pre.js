const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("uranium", {
    close: () => ipcRenderer.send("close"),
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
});
