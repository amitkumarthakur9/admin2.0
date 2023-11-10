interface Account {
    id: string;
    name: string;
}

interface Distributor {
    distributorCompanyId: string;
}

interface MutualfundCategory {
    id: number;
    name: string;
}

interface MutualfundSubcategory {
    id: number;
    name: string;
    mutualfundCategory: MutualfundCategory;
}

interface Fundhouse {
    id: number;
    name: string;
    rta: any; // You might want to replace 'any' with the actual type for rta
}

interface Mutualfund {
    id: string;
    name: string;
    fundhouse: Fundhouse;
    mutualfundSubcategory: MutualfundSubcategory;
    bseDematSchemeCode: string;
    rtaCode: string;
    nav: number;
}

interface AUMDataItem {
    id: string;
    folioNumber: string;
    currentValue: number;
    units: number;
    account: Account;
    distributor: Distributor;
    mutualfund: Mutualfund;
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
