import * as fs from 'fs';
import * as path from 'path';
import { AppSettings } from '../src/app/interfaces/appSettings-ineterface';
import { ipcMain, dialog, app } from 'electron';
import { staticDbCompactor, reloadStaticDatabase } from '../runtime/static-items-database';
import { compactDB, reloadDynamicDB } from '../runtime/databasehandler';
import { constants } from '../constants';

export function createDBBackup(appSettings: AppSettings) {
    ipcMain.on('create-db-backup', event => {
        _createBackup(event, appSettings);
    });

    ipcMain.on('restore-db-backup', event => {
        _restoreBackup(event, appSettings);
    });

    ipcMain.on('delete-db-renew', event => {
        _deleteRenewDB(event, appSettings);
    });
}


function _deleteRenewDB(event, appSettings: AppSettings) {
    let dbFileSrc = '';
    if (appSettings.staticItems) {
        dbFileSrc = path.join(app.getPath('appData'), '.internalSystemData', 'database/staticitemsDataStore.db');
    } else if (!appSettings.staticItems) {
        dbFileSrc = path.join(app.getPath('appData'), '.internalSystemData', 'database/regularclients.db');
    }

    fs.writeFile(dbFileSrc, '', err => {
        if (err) {
            event.sender.send('delete-db-renew-status', false);
        } else {
            if (appSettings.staticItems) {
                reloadStaticDatabase();
            } else if (!appSettings.staticItems) {
                reloadDynamicDB();
            }
            event.sender.send('delete-db-renew-status', true);
        }
    });

}

function _restoreBackup(event, appSettings: AppSettings) {
    let restoreFileName = '';
    if (appSettings.staticItems) {
        restoreFileName = path.join(app.getPath('appData'), '.internalSystemData', 'database/staticitemsDataStore.db');
    } else if (!appSettings.staticItems) {
        restoreFileName = path.join(app.getPath('appData'), '.internalSystemData', 'database/regularclients.db');

    }

    // tslint:disable-next-line: max-line-length
    dialog.showOpenDialog({properties: ['openFile'], filters: [{extensions: [constants.BACKUP_FILE_EXT_RAW], name: constants.APP_NAME + ' Backup file'}]}, filePaths => {
        if (filePaths[0] !== '' && filePaths[0] !== undefined) {
            fs.copyFile(filePaths[0], restoreFileName, err => {
                if (err) {
                    event.sender.send('restore-db-backup-status', false);
                } else {
                    if (appSettings.staticItems) {
                        reloadStaticDatabase();
                    } else if (!appSettings.staticItems) {
                        reloadDynamicDB();
                    }

                    event.sender.send('restore-db-backup-status', true);
                }
            });
        }
    });
}

// Yes i know that this will permently delete old records that are currently in app.

function _createBackup(event, appSettings: AppSettings) {
    let dbFileSrc = '';
    const backupFileName = new Date().toDateString().split(' ').join('-') + constants.BACKUP_FILE_EXT;
    if (appSettings.staticItems) {
        dbFileSrc = path.join(app.getPath('appData'), '.internalSystemData', 'database/staticitemsDataStore.db');
        staticDbCompactor();
    } else if (!appSettings.staticItems) {
        dbFileSrc = path.join(app.getPath('appData'), '.internalSystemData', 'database/regularclients.db');
        compactDB();
    }
    dialog.showOpenDialog({title: 'Save Backup', properties: ['openDirectory']}, filepathDes => {
        if (filepathDes[0] !== '' && filepathDes[0] !== undefined) {
            fs.copyFile(dbFileSrc, path.resolve(filepathDes[0] + path.sep + backupFileName), (err) => {
                if (err) {
                    event.sender.send('create-db-backup-status', false);
                } else {
                    event.sender.send('create-db-backup-status', true);
                }
            });
        }
    });
}

