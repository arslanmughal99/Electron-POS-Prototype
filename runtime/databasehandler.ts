import * as DataStore from 'nedb';
import * as path from 'path';
import { app, ipcMain } from 'electron';
import { DocUpdate } from '../src/app/interfaces/updateDocument-interface';


// tslint:disable-next-line: max-line-length
const db = new DataStore({filename: path.join(app.getPath('appData'), '.internalSystemData', 'database/regularclients.db'), autoload: true});

export function compactDB() {
    db.persistence.compactDatafile();
}

export function reloadDynamicDB () {
    db.loadDatabase();
}

export function dbHandler() {

    // Handler Database insertion calls from renderer process
    ipcMain.on('save-doc-to-db', (event, document) => {
        db.insert(document, (err, insDoc) => {
            if (err) {
                event.sender.send('status-save-doc', false);
            } else if (insDoc) {
                event.sender.send('status-save-doc', true);
            }
        });
    });

    // Update Document in the database from renderer process
    ipcMain.on('update-doc-to-db', (event, rules: DocUpdate) => {
        db.update({_id: rules._id}, rules.newDoc, {upsert: true}, (err, updatedDoc) => {
            if (err) {
                event.sender.send('status-update-doc', false);
            } else if (updatedDoc) {
                event.sender.send('status-update-doc', updatedDoc);
            }
        });
    });

    // Delete Docuemnt in the database from renderer process
    ipcMain.on('delete-doc-from-db', (event, docID) => {
        db.remove({_id: docID}, (err, numOfDocs) => {
            if (err) {
                event.sender.send('status-delete-doc', false);
            } else {
                event.sender.send('status-delete-doc', numOfDocs);
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

    // Get all records from databse on renderer request
    ipcMain.on('get-all-db-docs', (event, _) => {
        // Limit details to "_id", "name", "date", "reciptID"
        db.find({}, {
            _id: 1,
            clientName: 1,
            dateOfInvoice: 1,
            reciptId: 1,
            counterUser: 1
        }, (err, allDocs) => {
            if (err) {
                event.sender.send('status-get-docs', false);
            } else if (allDocs || []) {
                event.sender.send('status-get-docs', allDocs);
            }
        });
    });

    // Get single record on renderer request
    ipcMain.on('get-single-doc', (event, id) => {
        db.findOne({_id: id}, (err, doc) => {
            if (err) {
                event.sender.send('status-get-single-doc', false);
            } else if (doc || doc === []) {
                event.sender.send('status-get-single-doc', doc);
            }
        });
    });

}





