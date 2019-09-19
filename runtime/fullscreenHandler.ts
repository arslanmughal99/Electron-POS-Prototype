import { BrowserWindow } from 'electron';

export function fullScreenDetect(win: BrowserWindow) {
    win.on('enter-full-screen', () => {
        win.webContents.send('full-screen-status', true);
    });

    win.on('leave-full-screen', () => {
        win.webContents.send('full-screen-status', false);
    });
}