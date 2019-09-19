"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var electron_1 = require("electron");
var static_items_database_1 = require("../runtime/static-items-database");
var databasehandler_1 = require("../runtime/databasehandler");
var constants_1 = require("../constants");
function createDBBackup(appSettings) {
    electron_1.ipcMain.on('create-db-backup', function (event) {
        _createBackup(event, appSettings);
    });
    electron_1.ipcMain.on('restore-db-backup', function (event) {
        _restoreBackup(event, appSettings);
    });
    electron_1.ipcMain.on('delete-db-renew', function (event) {
        _deleteRenewDB(event, appSettings);
    });
}
exports.createDBBackup = createDBBackup;
function _deleteRenewDB(event, appSettings) {
    var dbFileSrc = '';
    if (appSettings.staticItems) {
        dbFileSrc = path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/staticitemsDataStore.db');
    }
    else if (!appSettings.staticItems) {
        dbFileSrc = path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/regularclients.db');
    }
    fs.writeFile(dbFileSrc, '', function (err) {
        if (err) {
            event.sender.send('delete-db-renew-status', false);
        }
        else {
            if (appSettings.staticItems) {
                static_items_database_1.reloadStaticDatabase();
            }
            else if (!appSettings.staticItems) {
                databasehandler_1.reloadDynamicDB();
            }
            event.sender.send('delete-db-renew-status', true);
        }
    });
}
function _restoreBackup(event, appSettings) {
    var restoreFileName = '';
    if (appSettings.staticItems) {
        restoreFileName = path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/staticitemsDataStore.db');
    }
    else if (!appSettings.staticItems) {
        restoreFileName = path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/regularclients.db');
    }
    // tslint:disable-next-line: max-line-length
    electron_1.dialog.showOpenDialog({ properties: ['openFile'], filters: [{ extensions: [constants_1.constants.BACKUP_FILE_EXT_RAW], name: constants_1.constants.APP_NAME + ' Backup file' }] }, function (filePaths) {
        if (filePaths[0] !== '' && filePaths[0] !== undefined) {
            fs.copyFile(filePaths[0], restoreFileName, function (err) {
                if (err) {
                    event.sender.send('restore-db-backup-status', false);
                }
                else {
                    if (appSettings.staticItems) {
                        static_items_database_1.reloadStaticDatabase();
                    }
                    else if (!appSettings.staticItems) {
                        databasehandler_1.reloadDynamicDB();
                    }
                    event.sender.send('restore-db-backup-status', true);
                }
            });
        }
    });
}
// Yes i know that this will permently delete old records that are currently in app.
function _createBackup(event, appSettings) {
    var dbFileSrc = '';
    var backupFileName = new Date().toDateString().split(' ').join('-') + constants_1.constants.BACKUP_FILE_EXT;
    if (appSettings.staticItems) {
        dbFileSrc = path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/staticitemsDataStore.db');
        static_items_database_1.staticDbCompactor();
    }
    else if (!appSettings.staticItems) {
        dbFileSrc = path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/regularclients.db');
        databasehandler_1.compactDB();
    }
    electron_1.dialog.showOpenDialog({ title: 'Save Backup', properties: ['openDirectory'] }, function (filepathDes) {
        if (filepathDes[0] !== '' && filepathDes[0] !== undefined) {
            fs.copyFile(dbFileSrc, path.resolve(filepathDes[0] + path.sep + backupFileName), function (err) {
                if (err) {
                    event.sender.send('create-db-backup-status', false);
                }
                else {
                    event.sender.send('create-db-backup-status', true);
                }
            });
        }
    });
}
//# sourceMappingURL=database-backup.js.map