const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const pty = require("node-pty");
const os = require("os");

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require("child_process");
    const path = require("path");

    const appFolder = path.resolve(process.execPath, "..");
    const rootAtomFolder = path.resolve(appFolder, "..");
    const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true,
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case "--squirrel-install":
        case "--squirrel-updated":
            spawnUpdate(["--createShortcut", exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case "--squirrel-uninstall":
            spawnUpdate(["--removeShortcut", exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case "--squirrel-obsolete":
            application.quit();
            return true;
    }
}

if (handleSquirrelEvent(app)) {
    app.quit();
}

if (require("electron-squirrel-startup")) {
    app.quit();
}

const shell = os.platform() === "win32" ? "cmd.exe" : "bash";

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

    var ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env,
    });

    ptyProcess.on("data", function (data) {
        mainWindow.webContents.send("terminal.incomingData", data);
    });

    ipcMain.on("terminal.keystroke", (event, key) => {
        ptyProcess.write(key);
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
