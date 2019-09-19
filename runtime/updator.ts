import {autoUpdater} from 'electron-updater';
import {ipcMain, BrowserWindow} from 'electron';

autoUpdater.autoDownload = false;

export function updateSchedular (win: BrowserWindow) {
    // check for updates
    autoUpdater.checkForUpdates();


    // if update available
    autoUpdater.on('update-available', () => {
        win.webContents.send('app-update-avail');
        ipcMain.on('yes-update-app', (conf) => {
            if (conf) {
                autoUpdater.downloadUpdate();
            }
        });

        autoUpdater.on('update-downloaded', () => {
            win.webContents.send('ready-to-install-update');
            ipcMain.on('yes-do-update', () => {
                autoUpdater.quitAndInstall();
            });
        });
    });


}
