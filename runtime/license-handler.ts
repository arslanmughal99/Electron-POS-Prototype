import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as Store from 'electron-store';
import { app } from 'electron';
import { decrypt } from 'strong-cryptor';
import { machineIdSync } from 'node-machine-id';
import { constants } from '../constants';

interface StatusSender {
    daysRemanning: number;
    liceseStatus: string;
}

// structure of license
interface LicenseStructure {
    endDate: string;
    vendorSign: string;
    machineID: string;
    iat?: number;
    exp?: number;
}


class LicenseManager {
    state = false;
    licensePath: string;
    machineID: string;
    machineIDHash: string;
    store = new Store();
    constructor() {
        this.timeStapmsHandler();
        this.licensePath = path.join(app.getPath('appData'), '.cusResSetApp') + path.sep + 'license.ralc';
        this.machineID = machineIdSync();
        this.machineIDHash = crypto.scryptSync(this.machineID, this.machineID.substring(0, 16), 10000).toString('hex');
    }

    timeStapmsHandler() {
        const hasStapms = this.store.has('bfs');
        if (!hasStapms) {
            this.store.set('bfs', Date.now());
            this.store.set('afs', Date.now() + 5);
        } else if (hasStapms) {
            const timeState = this.timeStapChecker();
            if (timeState) {
                this.store.set('bfs', this.store.get('afs'));
                this.store.set('afs', Date.now());
            }
        }
    }

    timeStapChecker() {
        // const bfs = this.store.get('bfs');
        const afs = this.store.get('afs');
        return Date.now() > afs;
    }

    private readLicenseFile() { // will read the license file and return its content
        try {
            const licenseFileContent: string = fs.readFileSync(this.licensePath).toString();
            return licenseFileContent;
        } catch (err) {
            if (err && err.code === 'ENOENT') {
                const status: StatusSender = {
                    daysRemanning: null,
                    liceseStatus: 'NOT_FOUND'
                };
                // License Not Found
                this.store.set('fixer', status);
                this.state = true;
            } else {
                const status: StatusSender = {
                    daysRemanning: null,
                    liceseStatus: 'FAILED_READING_LICENSE'
                };
                // unknown error while reading license file
                this.store.set('fixer', status);
            }
        }
    }

    private decryptLicenseContent() {   // decrypted the license content
        let decryptedFileContent: string;
        const licenseFileContent: string  = this.readLicenseFile() as string;
        if (licenseFileContent) {
            try {
                decryptedFileContent = decrypt(licenseFileContent, this.machineIDHash.substring(0, 32), 'hex');
                return decryptedFileContent;
            } catch (err) {
                if (err && err.code === 'MALFORMATED' || err.code === 'INVALID_SEPARATOR' || err.code === 'INVALID_KEY') {
                    const status: StatusSender = {
                        daysRemanning: null,
                        liceseStatus: 'CURRUPTED'
                    };
                    // if license is currupted
                    this.store.set('fixer', status);
                } else {
                    const status: StatusSender = {
                        daysRemanning: null,
                        liceseStatus: 'UNKNOWN_LICENSE_ERROR'
                    };
                    // if license is of differnt machine
                    this.store.set('fixer', status);
                }
            }
        } else if (!this.state) {
            const status: StatusSender = {
                daysRemanning: null,
                liceseStatus: 'EMPTY_LICENSE_FILE'
            };
            // if license is of differnt machine
            this.store.set('fixer', status);
        }

    }

    private verifyLicense() {
        const decryptedlLicenseContent: string = this.decryptLicenseContent() as string;
        if ( decryptedlLicenseContent ) {
            try {
                const token = jwt.verify(decryptedlLicenseContent, this.machineIDHash);
                return token;
            } catch (err) {
                if (err && err.name === 'TokenExpiredError') {
                    const status: StatusSender = {
                        daysRemanning: null,
                        liceseStatus: 'EXPIRED'
                    };
                    // Expired License
                    this.store.set('fixer', status);
                } else if (err && err.name !== 'TokenExpiredError') {
                    const status: StatusSender = {
                        daysRemanning: null,
                        liceseStatus: 'MACHINE_NOT_MATCHED'
                    };
                    // Invalid License
                    this.store.set('fixer', status);
                }
            }
        }
    }


    public parseToken() {
        const token: LicenseStructure = this.verifyLicense() as LicenseStructure;
        if ( token ) {
            const license: LicenseStructure = {
                endDate: decrypt(token.endDate, this.machineID.substring(0, 32), 'hex'),
                vendorSign: token.vendorSign,
                machineID: token.machineID,
                exp: token.exp
            };

            if (license.vendorSign !== constants.VENDOR_ID) {
                const status: StatusSender = {
                    daysRemanning: null,
                    liceseStatus: 'VENDOR_MISMATCH'
                };
                // if license is of differnt vendor
                this.store.set('fixer', status);
            } else {
                const status: StatusSender = {
                    daysRemanning: Math.floor((license.exp - (Date.now() / 1000)) / 86400),
                    liceseStatus: 'ACTIVE'
                };
                this.store.set('fixer', status);
            }

        }

    }

}

export function callLicenseManager() {
    // tslint:disable: no-console
    const licenseManager = new LicenseManager();
    licenseManager.parseToken();
}

