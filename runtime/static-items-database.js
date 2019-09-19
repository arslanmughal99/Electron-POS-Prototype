"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var Datastore = require("nedb");
// tslint:disable-next-line: max-line-length
var db = new Datastore({ filename: path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/staticitemsDataStore.db'), autoload: true });
function staticDbCompactor() {
    db.persistence.compactDatafile();
}
exports.staticDbCompactor = staticDbCompactor;
function reloadStaticDatabase() {
    db.loadDatabase();
}
exports.reloadStaticDatabase = reloadStaticDatabase;
function staticItemsDatabaseHandler() {
    // Insert Bill of Static item to Databsae
    electron_1.ipcMain.on('add-staticitem-toDB', function (event, item) {
        db.insert(item, function (err, returnDoc) {
            if (err) {
                event.sender.send('status-staticitem-insert', false);
            }
            else if (returnDoc) {
                event.sender.send('status-staticitem-insert', true);
            }
        });
    });
    // remove Bill of Static item from Databsae
    electron_1.ipcMain.on('remove-staticitem-toDB', function (event, _id) {
        db.remove({ _id: _id }, function (err, itemsRemNum) {
            if (err) {
                event.sender.send('status-staticitem-remove', false);
            }
            else if (itemsRemNum) {
                event.sender.send('status-staticitem-remove', true);
            }
        });
    });
    // update Bill of Static item in Databsae
    electron_1.ipcMain.on('update-staticitem-toDB', function (event, rules) {
        db.update(rules._id, rules.newDoc, { upsert: true }, function (err, itemUpdate) {
            if (err) {
                event.sender.send('status-staticitem-update', false);
            }
            else if (itemUpdate) {
                event.sender.send('status-staticitem-update', true);
            }
        });
    });
    // Get all docs for dashboard processing
    electron_1.ipcMain.on('get-all-bills', function (event, _) {
        db.find({}, function (err, allDocs) {
            if (err) {
                event.sender.send('get-all-bills-status', false);
            }
            else if (allDocs) {
                event.sender.send('get-all-bills-status', allDocs);
            }
        });
    });
    // Get All Bill of Static item from Databsae
    electron_1.ipcMain.on('getAll-staticitem-toDB', function (event) {
        db.find({}, function (err, itemsArray) {
            if (err) {
                event.sender.send('status-staticitem-getAll', false);
            }
            else if (itemsArray) {
                event.sender.send('status-staticitem-getAll', itemsArray);
            }
        });
    });
    // Get One Bill of Static item from Databsae
    electron_1.ipcMain.on('getOne-staticitem-toDB', function (event, _id) {
        db.findOne({ _id: _id }, function (err, bill) {
            if (err) {
                event.sender.send('status-staticitem-getOne', false);
            }
            else if (bill) {
                event.sender.send('status-staticitem-getOne', bill);
            }
        });
    });
}
exports.staticItemsDatabaseHandler = staticItemsDatabaseHandler;
//# sourceMappingURL=static-items-database.js.map