"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_updater_1 = require("electron-updater");
var electron_1 = require("electron");
electron_updater_1.autoUpdater.autoDownload = false;
function updateSchedular(win) {
    // check for updates
    electron_updater_1.autoUpdater.checkForUpdates();
    // if update available
    electron_updater_1.autoUpdater.on('update-available', function () {
        win.webContents.send('app-update-avail');
        electron_1.ipcMain.on('yes-update-app', function (conf) {
            if (conf) {
                electron_updater_1.autoUpdater.downloadUpdate();
            }
        });
        electron_updater_1.autoUpdater.on('update-downloaded', function () {
            win.webContents.send('ready-to-install-update');
            electron_1.ipcMain.on('yes-do-update', function () {
                electron_updater_1.autoUpdater.quitAndInstall();
            });
        });
    });
}
exports.updateSchedular = updateSchedular;
//# sourceMappingURL=updator.js.map