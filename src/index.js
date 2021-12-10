const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

if (require("electron-squirrel-startup")) {
    app.quit();
}

const windows = {};

const createWindow = () => {
    const options = {
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "js/pre.js"),
            contextIsolation: true,
        },
    };

    if (process.platform != "win32") options.frame = true;

    const mainWindow = new BrowserWindow(options);

    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.webContents.once("did-finish-load", () => {
        windows[`${mainWindow.webContents.getOSProcessId()}`] = [mainWindow, false];
    });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// extra ipc info
ipcMain.on("close", function (e) {
    windows[`${e.sender.getOSProcessId()}`][0].close();
});

ipcMain.on("minimize", function (e) {
    if (windows[`${e.sender.getOSProcessId()}`]) windows[`${e.sender.getOSProcessId()}`][0].minimize();
});

ipcMain.on("maximize", function (e) {
    if (windows[`${e.sender.getOSProcessId()}`]) {
        var maximized = windows[`${e.sender.getOSProcessId()}`][1];

        if (!maximized) windows[`${e.sender.getOSProcessId()}`][0].maximize();
        else windows[`${e.sender.getOSProcessId()}`][0].unmaximize();
        windows[`${e.sender.getOSProcessId()}`][1] = !maximized;
    }
});
