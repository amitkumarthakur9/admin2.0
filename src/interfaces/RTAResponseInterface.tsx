interface User {
    id: string;
    name: string;
    panNumber: string;
}

interface FundHouse {
    id: number;
    name: string;
    rta: any; // Replace 'any' with the specific type if available
}

interface MutualFund {
    bseDematSchemeCode: string;
    rtaCode: string;
    id: string;
    name: string;
    fundhouse: FundHouse;
}

interface Account {
    clientId: string;
    name: string;
    user: User[];
}

export interface RTAReconcilation {
    id: string;
    orderReferenceNumber: string | null;
    amount: number;
    paymentDate: string;
    transactionType: string;
    folioNumber: string;
    transactionStatus: string;
    account: Account;
    mutualfund: MutualFund;
    createdAt: string;
}

export interface RTAResponseResponseInterface {
    code: number;
    message: string;
    error: any[];
    data: RTAReconcilation[];
    count: number;
    filterCount: number;
    totalCount: number;
}

