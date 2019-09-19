export interface RegularClientRecord {
    clientName: string;
    clientPhone: string;
    clientCNIC: string;
    dateOfInvoice: string;
    itemsPurchased: RegularClientItems[];
    reciptId: string;
    counterUser: string;
    salesTaxPercent: number;
}

export interface RegularClientItems {
    itemName: string;
    itemCategory: string;
    itemQuantity: number;
    unitOfMeasure: string;
    pricePerUnit: number;
}
