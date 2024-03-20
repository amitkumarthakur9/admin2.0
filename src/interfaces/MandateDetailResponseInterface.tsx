interface Fundhouse {
    id: number;
    name: string;
    aum: number;
    rta: {
        id: number;
        name: string;
        shortName: string | null;
    };
}

interface Transaction {
    id: string;
    account: {
        id: string;
        clientId: string;
        name: string;
    };
    amount: number;
    units: null; // Adjust if units can be present
    paymentDate: null; // Adjust if payment date can be present
    transactionStatus: {
        id: number;
        name: string;
    };
    createdAt: string;
}

interface Sip {
    id: string;
    amount: number;
    startDate: string;
    sipReferenceNumber: string;
    account: {
        id: string;
        name: string;
        clientId: string;
    };
    createdAt: string;
}

interface FundDetail {
    name: string;
    aum: number;
    minSIPAmount: number;
    minInvestment: number;
    minAdditionalInvestment: number;
    fundhouse: Fundhouse;
    transactions: Transaction[];
    sip: Sip[];
}

export interface MandateDetailInterface {
    message: string;
    error: any[]; // You may need to adjust the type based on your actual data structure
    data: FundDetail;
}
