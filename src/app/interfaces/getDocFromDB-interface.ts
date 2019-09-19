import { RegularClientItems } from './record-interface';

export interface GetFromDB {
    _id: string;
    clientName: string;
    clientPhone: string;
    clientCNIC: string;
    dateOfInvoice: string;
    itemsPurchased: RegularClientItems[];
    reciptId: string;
    counterUser: string;
    salesTaxPercent: number;
}
