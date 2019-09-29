import {autoUpdater} from 'electron-updater';
import {ipcMain, BrowserWindow} from 'electron';
import * as log from 'electron-log';

autoUpdater.autoDownload = false;

export function updateSchedular (win: BrowserWindow) {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    // check for updates
    autoUpdater.checkForUpdates();


    // if update available
    autoUpdater.on('update-available', () => {
        win.webContents.send('app-update-avail');
        ipcMain.on('yes-update-app', _ => {
            autoUpdater.downloadUpdate();
        });

        autoUpdater.on('update-downloaded', _ => {
            win.webContents.send('ready-to-install-update');
            ipcMain.on('yes-do-update', () => {
                autoUpdater.quitAndInstall();
            });
        });
    });


}
