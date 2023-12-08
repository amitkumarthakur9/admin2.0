interface MutualFundHolding {
    id: string;
    userId: string;
    accountId: string;
    mutualfundDividendTypeId: string;
    xirr: number;
    avgNav: number;
    units: number;
    currentValue: number;
    investedValue: number;
    load: any | null; // Adjust this type based on the actual data
    loadNote: string | null;
}

interface MutualFund {
    id: string;
    name: string;
    fundhouse: {
        id: number;
        name: string;
        rta: any | null; // Adjust this type based on the actual data
        logoUrl: string;
    };
    mutualfundSubcategory: {
        id: number;
        name: string;
        mutualfundCategory: {
            id: number;
            name: string;
        };
    };
    bseDematSchemeCode: string;
    rtaCode: string;
    nav: number;
}

interface Distributor {
    distributorCompanyId: string;
}

interface User {
    id: string;
    panNumber: string;
}

interface Account {
    clientId: string;
    id: string;
    name: string;
    holdings: MutualFundHolding[];
    user: User;
}

export interface AUMDetailInterface {
    id: string;
    folioNumber: string;
    currentValue: number;
    units: number;
    account: Account;
    distributor: Distributor;
    mutualfund: MutualFund;
    investedValue: number;
}

export interface AUMDetailResponseInterface {
    message: string;
    error: any[];
    data: AUMDetailInterface;
}
