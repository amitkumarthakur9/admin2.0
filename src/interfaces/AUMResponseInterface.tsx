interface User {
    id: string;
    panNumber: string;
}

interface Account {
    id: string;
    clientId: string;
    name: string;
    user: User;
}

interface MutualFundCategory {
    id: number;
    name: string;
}

interface MutualFundSubcategory {
    id: number;
    name: string;
    mutualfundCategory: MutualFundCategory;
}

interface Fundhouse {
    id: number;
    name: string;
    rta: any; // You can replace 'any' with the actual type if available
    logoUrl: string;
}

interface MutualFund {
    id: string;
    name: string;
    fundhouse?: Fundhouse;
    mutualfundSubcategory?: MutualFundSubcategory;
    bseDematSchemeCode?: any; // You can replace 'any' with the actual type if available
    rtaCode?: string;
    nav?: number;
}

interface AUMDataItem {
    id: string;
    folioNumber: string;
    currentValue: number;
    investedValue: number;
    units: number;
    account: Account;
    mutualfund?: MutualFund;
}

interface AUMResponseInterface {
    code: number;
    message: string;
    error: any[]; // You can replace 'any' with the actual type if available
    data: AUMDataItem[];
    count: number;
    filterCount: number;
    totalCount: number;
}

