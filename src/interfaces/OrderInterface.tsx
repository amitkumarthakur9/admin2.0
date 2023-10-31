export interface OrderInterface {

    id: string;
    amount: number;
    units: number | null;
    orderReferenceNumber: string | null;
    orderStatus: {
        id: number;
        name: string;
    };
    orderType: {
        id: number;
        name: string;
    };
    startDate: string | null;
    createdAt: string;
    account: {
        id: string;
        name: string;
        clientId: string;
    };
    mutualfunds: {
        id: string;
        name: string;
        fundhouse: {
            id: number;
            name: string;
            logoUrl: string;
        };
        mutualfundType: {
            id: number;
            name: string;
        }
    };

}