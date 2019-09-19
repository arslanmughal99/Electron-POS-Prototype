import { constants } from '../constants/constants';

export const schema: any = {
    printLogo: {
      default: constants.PRINT_LOGO
    },
    printIter: {
      default: constants.PRINT_ITER
    },
    appSettings: {
      default: {
        companyName: constants.COMPANY_NAME,
        companyContact: constants.COMPANY_CONTACT,
        companyAddress: constants.COMPANY_ADDRESS,
        resetFormOnSave: constants.RESET_FROM_ON_SAVE,
        ccustomReciptMessage: constants.CUS_RECIPT_MSG,
        staticItems: constants.STATIC_ITEMS,
        counterUser: constants.COUNTER_USER,
        notificationDuraton: constants.NOTIFICATION_TIME,
        salesTaxPercent: constants.SALES_TAX
      }
    },
    categories: {
      default: []
    },
    units: {
      default: []
    },
    lastReciptId: {
      default: '0'
    },
    companyLogo: {
      default: ''
    },
    lastTheme: {
      default: 'dark-theme-red'
    },
    vendorID: {
      // tslint:disable-next-line: max-line-length
      default: 'da07d863572ded9f496bf93b7dd81d02daf78dfdda0492a170e7ecf52e5e773c2fa191259079f9424d421b8df886cd12834b552bc85d6db446a8a2a9e25691f8930c26953f37e32bf79e42de53553d79545dbe328eb9eb11453341a1eeaf70a333859fda'
    },
  };

