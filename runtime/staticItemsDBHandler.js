"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var electron_1 = require("electron");
var DataStore = require("nedb");
// tslint:disable-next-line: max-line-length
var db = new DataStore({ filename: path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/staticItems.db'), autoload: true });
function itemsDBCompactor() {
    db.persistence.compactDatafile();
}
exports.itemsDBCompactor = itemsDBCompactor;
function staticItemsDBHandler() {
    // Handler Database insertion calls from renderer process
    electron_1.ipcMain.on('save-item-toDB', function (event, document) {
        db.insert(document, function (err, insDoc) {
            if (err) {
                event.sender.send('status-save-item', false);
            }
            else if (insDoc) {
                event.sender.send('status-save-item', true);
            }
        });
    });
    // Remove item
    electron_1.ipcMain.on('remove-item-toDB', function (event, _id) {
        db.remove({ _id: _id }, function (err, numOfDocs) {
            if (err) {
                event.sender.send('status-remove-item', false);
            }
            else {
                event.sender.send('status-remove-item', true);
            }
        });
    });
    // Get all items
    electron_1.ipcMain.on('getall-item-fromDB', function (event) {
        db.find({}, function (err, numOfDocs) {
            if (err) {
                event.sender.send('status-get-items', false);
            }
            else {
                event.sender.send('status-get-items', numOfDocs);
            }
        });
    });
    // Get one items
    electron_1.ipcMain.on('getone-item-fromDB', function (event, _id) {
        db.findOne({ _id: _id }, function (err, singleDoc) {
            if (err) {
                event.sender.send('status-getone-item', false);
            }
            else {
                event.sender.send('status-getone-item', singleDoc);
            }
        });
    });
    // Update items
    electron_1.ipcMain.on('update-item-toDB', function (event, rule) {
        db.update({ _id: rule._id }, rule.newDoc, { upsert: true }, function (err, numOfDocs) {
            if (err) {
                event.sender.send('status-update-items', false);
            }
            else {
                event.sender.send('status-update-items', numOfDocs);
            }
        });
    });
}
exports.staticItemsDBHandler = staticItemsDBHandler;
//# sourceMappingURL=staticItemsDBHandler.js.map