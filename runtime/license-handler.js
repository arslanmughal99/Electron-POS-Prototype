"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var Store = require("electron-store");
var electron_1 = require("electron");
var strong_cryptor_1 = require("strong-cryptor");
var node_machine_id_1 = require("node-machine-id");
var constants_1 = require("../constants");
var LicenseManager = /** @class */ (function () {
    function LicenseManager() {
        this.state = false;
        this.store = new Store();
        this.timeStapmsHandler();
        this.licensePath = path.join(electron_1.app.getPath('appData'), '.cusResSetApp') + path.sep + 'license.ralc';
        this.machineID = node_machine_id_1.machineIdSync();
        this.machineIDHash = crypto.scryptSync(this.machineID, this.machineID.substring(0, 16), 10000).toString('hex');
    }
    LicenseManager.prototype.timeStapmsHandler = function () {
        var hasStapms = this.store.has('bfs');
        if (!hasStapms) {
            this.store.set('bfs', Date.now());
            this.store.set('afs', Date.now() + 5);
        }
        else if (hasStapms) {
            var timeState = this.timeStapChecker();
            if (timeState) {
                this.store.set('bfs', this.store.get('afs'));
                this.store.set('afs', Date.now());
            }
        }
    };
    LicenseManager.prototype.timeStapChecker = function () {
        // const bfs = this.store.get('bfs');
        var afs = this.store.get('afs');
        return Date.now() > afs;
    };
    LicenseManager.prototype.readLicenseFile = function () {
        try {
            var licenseFileContent = fs.readFileSync(this.licensePath).toString();
            return licenseFileContent;
        }
        catch (err) {
            if (err && err.code === 'ENOENT') {
                var status_1 = {
                    daysRemanning: null,
                    liceseStatus: 'NOT_FOUND'
                };
                // License Not Found
                this.store.set('fixer', status_1);
                this.state = true;
            }
            else {
                var status_2 = {
                    daysRemanning: null,
                    liceseStatus: 'FAILED_READING_LICENSE'
                };
                // unknown error while reading license file
                this.store.set('fixer', status_2);
            }
        }
    };
    LicenseManager.prototype.decryptLicenseContent = function () {
        var decryptedFileContent;
        var licenseFileContent = this.readLicenseFile();
        if (licenseFileContent) {
            try {
                decryptedFileContent = strong_cryptor_1.decrypt(licenseFileContent, this.machineIDHash.substring(0, 32), 'hex');
                return decryptedFileContent;
            }
            catch (err) {
                if (err && err.code === 'MALFORMATED' || err.code === 'INVALID_SEPARATOR' || err.code === 'INVALID_KEY') {
                    var status_3 = {
                        daysRemanning: null,
                        liceseStatus: 'CURRUPTED'
                    };
                    // if license is currupted
                    this.store.set('fixer', status_3);
                }
                else {
                    var status_4 = {
                        daysRemanning: null,
                        liceseStatus: 'UNKNOWN_LICENSE_ERROR'
                    };
                    // if license is of differnt machine
                    this.store.set('fixer', status_4);
                }
            }
        }
        else if (!this.state) {
            var status_5 = {
                daysRemanning: null,
                liceseStatus: 'EMPTY_LICENSE_FILE'
            };
            // if license is of differnt machine
            this.store.set('fixer', status_5);
        }
    };
    LicenseManager.prototype.verifyLicense = function () {
        var decryptedlLicenseContent = this.decryptLicenseContent();
        if (decryptedlLicenseContent) {
            try {
                var token = jwt.verify(decryptedlLicenseContent, this.machineIDHash);
                return token;
            }
            catch (err) {
                if (err && err.name === 'TokenExpiredError') {
                    var status_6 = {
                        daysRemanning: null,
                        liceseStatus: 'EXPIRED'
                    };
                    // Expired License
                    this.store.set('fixer', status_6);
                }
                else if (err && err.name !== 'TokenExpiredError') {
                    var status_7 = {
                        daysRemanning: null,
                        liceseStatus: 'MACHINE_NOT_MATCHED'
                    };
                    // Invalid License
                    this.store.set('fixer', status_7);
                }
            }
        }
    };
    LicenseManager.prototype.parseToken = function () {
        var token = this.verifyLicense();
        if (token) {
            var license = {
                endDate: strong_cryptor_1.decrypt(token.endDate, this.machineID.substring(0, 32), 'hex'),
                vendorSign: token.vendorSign,
                machineID: token.machineID,
                exp: token.exp
            };
            if (license.vendorSign !== constants_1.constants.VENDOR_ID) {
                var status_8 = {
                    daysRemanning: null,
                    liceseStatus: 'VENDOR_MISMATCH'
                };
                // if license is of differnt vendor
                this.store.set('fixer', status_8);
            }
            else {
                var status_9 = {
                    daysRemanning: Math.floor((license.exp - (Date.now() / 1000)) / 86400),
                    liceseStatus: 'ACTIVE'
                };
                this.store.set('fixer', status_9);
            }
        }
    };
    return LicenseManager;
}());
function callLicenseManager() {
    // tslint:disable: no-console
    var licenseManager = new LicenseManager();
    licenseManager.parseToken();
}
exports.callLicenseManager = callLicenseManager;
//# sourceMappingURL=license-handler.js.map