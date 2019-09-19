"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataStore = require("nedb");
var path = require("path");
var electron_1 = require("electron");
// tslint:disable-next-line: max-line-length
var db = new DataStore({ filename: path.join(electron_1.app.getPath('appData'), '.internalSystemData', 'database/regularclients.db'), autoload: true });
function compactDB() {
    db.persistence.compactDatafile();
}
exports.compactDB = compactDB;
function reloadDynamicDB() {
    db.loadDatabase();
}
exports.reloadDynamicDB = reloadDynamicDB;
function dbHandler() {
    // Handler Database insertion calls from renderer process
    electron_1.ipcMain.on('save-doc-to-db', function (event, document) {
        db.insert(document, function (err, insDoc) {
            if (err) {
                event.sender.send('status-save-doc', false);
            }
            else if (insDoc) {
                event.sender.send('status-save-doc', true);
            }
        });
    });
    // Update Document in the database from renderer process
    electron_1.ipcMain.on('update-doc-to-db', function (event, rules) {
        db.update({ _id: rules._id }, rules.newDoc, { upsert: true }, function (err, updatedDoc) {
            if (err) {
                event.sender.send('status-update-doc', false);
            }
            else if (updatedDoc) {
                event.sender.send('status-update-doc', updatedDoc);
            }
        });
    });
    // Delete Docuemnt in the database from renderer process
    electron_1.ipcMain.on('delete-doc-from-db', function (event, docID) {
        db.remove({ _id: docID }, function (err, numOfDocs) {
            if (err) {
                event.sender.send('status-delete-doc', false);
            }
            else {
                event.sender.send('status-delete-doc', numOfDocs);
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
    // Get all records from databse on renderer request
    electron_1.ipcMain.on('get-all-db-docs', function (event, _) {
        // Limit details to "_id", "name", "date", "reciptID"
        db.find({}, {
            _id: 1,
            clientName: 1,
            dateOfInvoice: 1,
            reciptId: 1,
            counterUser: 1
        }, function (err, allDocs) {
            if (err) {
                event.sender.send('status-get-docs', false);
            }
            else if (allDocs || []) {
                event.sender.send('status-get-docs', allDocs);
            }
        });
    });
    // Get single record on renderer request
    electron_1.ipcMain.on('get-single-doc', function (event, id) {
        db.findOne({ _id: id }, function (err, doc) {
            if (err) {
                event.sender.send('status-get-single-doc', false);
            }
            else if (doc || doc === []) {
                event.sender.send('status-get-single-doc', doc);
            }
        });
    });
}
exports.dbHandler = dbHandler;
//# sourceMappingURL=databasehandler.js.map