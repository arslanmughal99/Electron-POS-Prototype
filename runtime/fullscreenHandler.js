"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fullScreenDetect(win) {
    win.on('enter-full-screen', function () {
        win.webContents.send('full-screen-status', true);
    });
    win.on('leave-full-screen', function () {
        win.webContents.send('full-screen-status', false);
    });
}
exports.fullScreenDetect = fullScreenDetect;
//# sourceMappingURL=fullscreenHandler.js.map