export interface OrderDataInterface {
    message: string;
    error: any[];
    data: Order;
}

export interface Order {
    id: string;
    startDate: string | null;
    endDate: string | null;
    orderReferenceNumber: string;
    clientCode: string;
    customerName: string;
    mutualFund: {
        id: string;
        name: string;
        fundhouse: {
            id: number;
            name: string;
            rta: any | null; // Adjust this type based on the actual data
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
    transactions: any[]; // Adjust this type based on the actual data
    units: number | null;
    amount: number;
    account: {
        clientId: string;
        name: string;
        accountType: {
            id: number;
            name: string;
        };
        userAccountLinks: {
            user: {
                name: string;
            };
        }[];
        dematAccount: {
            id: string;
            userId: string;
            accountTypeId: number;
            dpId: string;
            boId: string;
        };
        orders: {
            id: string;
        }[];
    };
    transactionType: string[]; // Adjust this type based on the actual data
    orderStatus: {
        id: number;
        name: string;
    };
    remark: string;
    sourceOfOrder: {
        id: number;
        name: string;
    };
    sipReferenceNumber: string | null;
    firstOrder: string;

}
