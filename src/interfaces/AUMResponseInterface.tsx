interface User {
    id: string;
    panNumber: string;
}

interface FundCategory {
    id: number;
    name: string;
}

interface MutualFundSubcategory {
    id: number;
    name: string;
    mutualfundCategory: FundCategory;
}

interface FundHouse {
    id: number;
    name: string;
    rta: any; // You can replace 'any' with the specific type if available
    logoUrl: string;
}

interface MutualFund {
    id: string;
    name: string;
    fundhouse: FundHouse;
    mutualfundSubcategory: MutualFundSubcategory;
    bseDematSchemeCode: string;
    rtaCode: string;
    nav: number;
}

interface Account {
    id: string;
    clientId: string;
    name: string;
    user: User;
}

interface AUMDataItem {
    id: string;
    folioNumber: string;
    currentValue: number;
    units: number;
    account: Account;
    mutualfund: MutualFund;
}

interface AUMResponseInterface {
    code: number;
    message: string;
    error: any[]; // Depending on the actual error response structure
    data: AUMDataItem[];
    count: number;
    filterCount: number;
    totalCount: number;
}
