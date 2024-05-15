interface User {
    id: string;
    name: string;
    panNumber: string;
}

interface Rta {
    id: number;
    name: string;
    shortName: string | null;
}

interface FundHouse {
    id: number;
    name: string;
    rta: Rta | null; // Replace 'any' with the specific type if available
}

interface MutualFund {
    bseDematSchemeCode: string;
    rtaCode: string;
    id: string;
    name: string;
    fundhouse: FundHouse;
    dividendType: {
        id: string;
    name: string;
    }
    optionType: {
        id: string;
    name: string;
    }
    deliveryType: {
        id: string;
    name: string;
    }
}

interface Account {
    id: string;
    clientId: string;
    name: string;
    user: User[];
}

interface ManagementUsers{
    id: string;
    name: string;

}
interface Distributor {
    id: string;
    name: string;
    managementUsers: ManagementUser[];
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
    units: null | number;
    nav: null | number;
    distributor: Distributor;
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
