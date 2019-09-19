export interface StaticItemBill {
    _id?: string;
    reciptID: string;
    clientName: string;
    dateOfInvoice: string;
    counterUser: string;
    itemsPurchased: StaticItemsForBill[];
    salesTaxPercent: number;
}

export interface StaticItemsForBill {
    _id: string;
    itemName: string;
    itemPrice: number;
    itemDiscount: number;
    itemQuantity: number;
    itemCategory: string;
}


