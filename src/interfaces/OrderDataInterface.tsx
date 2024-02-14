export interface OrderDataInterface {
    message: string;
    error: any[];
    data: Order;
}

interface TransactionStatus {
    id: number;
    name: string;
}

interface TransactionType {
    id: number;
    name: string;
}

interface Folio {
    folioNumber: string;
}

interface Transaction {
    nav: any; // Replace 'any' with the appropriate type if known
    amount: number;
    units: number;
    paymentDate: any; // Replace 'any' with the appropriate type if known
    settlementDate: any; // Replace 'any' with the appropriate type if known
    navAllotmentDate: any; // Replace 'any' with the appropriate type if known
    transactionStatus: TransactionStatus;
    transactionType: TransactionType;
    folio?: Folio;
}

export interface Order {
    id: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    orderType: {
        id: number;
        name: string;
    };
    orderReferenceNumber: string;
    mutualFund: {
        id: string;
        name: string;
        fundhouse: {
            id: number;
            name: string;
            logoUrl: string;
            rta: any; // You may want to replace 'any' with the appropriate type if known
        };
        mutualfundSubcategory: {
            name: string;
            mutualfundCategory: {
                id: number;
                name: string;
                valueResearchId: string;
            };
        };
    };
    isin: string;
    transactions?: Transaction[];
    units: any; // You may want to replace 'any' with the appropriate type if known
    amount: number;
    account: {
        clientId: string;
        name: string;
        user: {
            name: string;
            panNumber: string;
        }[];
        dematAccount: {
            id: string;
            userId: string;
            accountTypeId: number;
            dpId: string;
            boId: string;
        };
    };
    transactionType: {
        transactionType: {
            id: number;
            name: string;
        };
        folio: any; // You may want to replace 'any' with the appropriate type if known
    }[];
    orderStatus: {
        id: number;
        name: string;
    };
    remark: string;
    sourceOfOrder: {
        id: number;
        name: string;
    };
    sipReferenceNumber: string;
    firstOrder: string;
}
