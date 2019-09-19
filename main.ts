import { staticItemsDatabaseHandler, staticDbCompactor } from './runtime/static-items-database';
import { staticItemsDBHandler, itemsDBCompactor } from './runtime/staticItemsDBHandler';
import { schema } from './appConfigSchema';
import { app, BrowserWindow, screen } from 'electron';
import { dbHandler, compactDB } from './runtime/databasehandler';
import { fullScreenDetect } from './runtime/fullscreenHandler';
import { callLicenseManager } from './runtime/license-handler';
import { getPdfCommandStatic } from './runtime/pdf-generator-staic';
import { getPdfCommandDynamic } from './runtime/pdf-generator-dynamic';
import { createDBBackup } from './runtime/database-backup';
import * as Store from 'electron-store';
import * as path from 'path';
import * as url from 'url';
import { AppSettings } from './src/app/interfaces/appSettings-ineterface';


// const appSettings = JSON.parse(localStorage.getItem('appSettings'));
let win, serve;
const electronStore = new Store({schema: schema, cwd: path.join(app.getPath('appData'), '.cusResSetApp')});
const appSettings: AppSettings = electronStore.get('appSettings');
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    minHeight: 730,
    minWidth: 1200,
    show: false,
    frame: false,
    // transparent: true,
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
    },
  });



  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  if (!serve) {
    win.on('devtools-opened', () => {
      win.webContents.closeDevTools();
    });
  }


  win.once('ready-to-show', () => {
    win.show();
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.on('minimize', () => {
    if (appSettings.staticItems) {
      staticDbCompactor();
      itemsDBCompactor();
    } else {
      compactDB();
    }
  });

}


try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow();
    // LICENSE HANDLER
    callLicenseManager();
    fullScreenDetect(win);

    // BACKUP AND RESTORE SERVICE
    createDBBackup(appSettings);

    // LOAD STATIC ITEMS DATABASE IF IT IS SET TO BE USED OTHERWHISE DYNAMIC ITEMS WILL BE USED;
    if (appSettings.staticItems) {
      getPdfCommandStatic();
      staticItemsDBHandler();
      staticItemsDatabaseHandler();    // pdf generator for static mode
    } else {
      dbHandler();
      getPdfCommandDynamic();    // pdf generator for dynamic mode
    }

  });


  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
