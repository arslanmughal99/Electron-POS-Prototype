import * as path from 'path';
import { app, ipcMain } from 'electron';
import * as DataStore from 'nedb';

// tslint:disable-next-line: max-line-length
const db = new DataStore({filename: path.join(app.getPath('appData'), '.internalSystemData', 'database/staticItems.db'), autoload: true});

export function itemsDBCompactor() {
    db.persistence.compactDatafile();
}

export function staticItemsDBHandler() {

    // Handler Database insertion calls from renderer process
    ipcMain.on('save-item-toDB', (event, document) => {
        db.insert(document, (err, insDoc) => {
            if (err) {
                event.sender.send('status-save-item', false);
            } else if (insDoc) {
                event.sender.send('status-save-item', true);
            }
        });
    });

    // Remove item
    ipcMain.on('remove-item-toDB', (event, _id) => {
        db.remove({_id: _id}, (err, numOfDocs) => {
            if (err) {
                event.sender.send('status-remove-item', false);
            } else {
                event.sender.send('status-remove-item', true);
            }
        });
    });

    // Get all items
    ipcMain.on('getall-item-fromDB', (event) => {
        db.find({}, (err, numOfDocs) => {
            if (err) {
                event.sender.send('status-get-items', false);
            } else {
                event.sender.send('status-get-items', numOfDocs);
            }
        });
    });

    // Get one items
    ipcMain.on('getone-item-fromDB', (event, _id) => {
        db.findOne({_id: _id}, (err, singleDoc) => {
            if (err) {
                event.sender.send('status-getone-item', false);
            } else {
                event.sender.send('status-getone-item', singleDoc);
            }
        });
    });

    // Update items
    ipcMain.on('update-item-toDB', (event, rule) => {
        db.update({_id: rule._id}, rule.newDoc, {upsert: true}, (err, numOfDocs) => {
            if (err) {
                event.sender.send('status-update-items', false);
            } else {
                event.sender.send('status-update-items', numOfDocs);
            }
        });
    });


}
