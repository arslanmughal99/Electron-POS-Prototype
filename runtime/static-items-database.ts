import { app, ipcMain } from 'electron';
import * as path from 'path';
import * as Datastore from 'nedb';

// tslint:disable-next-line: max-line-length
const db = new Datastore({filename: path.join(app.getPath('appData'), '.internalSystemData', 'database/staticitemsDataStore.db'), autoload: true});

export function staticDbCompactor() {
    db.persistence.compactDatafile();
}

export function reloadStaticDatabase() {
    db.loadDatabase();
}

export function staticItemsDatabaseHandler() {

    // Insert Bill of Static item to Databsae
    ipcMain.on('add-staticitem-toDB', (event, item) => {
        db.insert(item, (err, returnDoc) => {
            if (err) {
                event.sender.send('status-staticitem-insert', false);
            } else if (returnDoc) {
                event.sender.send('status-staticitem-insert', true);
            }
        });
    });

    // remove Bill of Static item from Databsae
    ipcMain.on('remove-staticitem-toDB', (event, _id) => {
        db.remove({_id: _id}, (err, itemsRemNum) => {
            if (err) {
                event.sender.send('status-staticitem-remove', false);
            } else if (itemsRemNum) {
                event.sender.send('status-staticitem-remove', true);
            }
        });
    });

    // update Bill of Static item in Databsae
    ipcMain.on('update-staticitem-toDB', (event, rules) => {
        db.update(rules._id, rules.newDoc, { upsert: true } , (err, itemUpdate) => {
            if (err) {
                event.sender.send('status-staticitem-update', false);
            } else if (itemUpdate) {
                event.sender.send('status-staticitem-update', true);
            }
        });
    });

    // Get all docs for dashboard processing
    ipcMain.on('get-all-bills', (event, _) => {
        db.find({}, (err, allDocs) => {
            if (err) {
                event.sender.send('get-all-bills-status', false);
            } else if (allDocs) {
                event.sender.send('get-all-bills-status', allDocs);
            }
        });
    });

    // Get All Bill of Static item from Databsae
    ipcMain.on('getAll-staticitem-toDB', (event) => {
        db.find({}, (err, itemsArray) => {
            if (err) {
                event.sender.send('status-staticitem-getAll', false);
            } else if (itemsArray) {
                event.sender.send('status-staticitem-getAll', itemsArray);
            }
        });
    });

    // Get One Bill of Static item from Databsae
    ipcMain.on('getOne-staticitem-toDB', (event, _id) => {
        db.findOne({_id: _id}, (err, bill) => {
            if (err) {
                event.sender.send('status-staticitem-getOne', false);
            } else if (bill) {
                event.sender.send('status-staticitem-getOne', bill);
            }
        });
    });

}
