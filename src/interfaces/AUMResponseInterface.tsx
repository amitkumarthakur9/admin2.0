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
    xirr: number;
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

interface AumSchemeWise {
    code: number;
    message: string;
    error: any[]; // You can replace 'any' with the actual type if available
    data: AumSchemeWiseData[];
    count: number;
    filterCount: number;
    totalCount: number;
}

interface AumSchemeWiseData {
    name: string;
    optionType: string;
    dividendType: string;
    currentValue: number;
    investedValue: number;
}

interface FundhouseWise {
    code: number;
    message: string;
    error: any[]; // You can replace 'any' with the actual type if available
    data: FundhouseWiseData[];
    count: number;
    filterCount: number;
    totalCount: number;
}
    

interface FundhouseWiseData{
    name: string;
    currentValue: number;
    investedValue: number;
}


interface RTAwise {
    code: number;
    message: string;
    error: any[]; // You can replace 'any' with the actual type if available
    data: FundhouseWiseData[];
    count: number;
    filterCount: number;
    totalCount: number;
}

interface RTAwiseData {
    name: string;
    currentValue: number;
    investedValue: number;
}
interface SchemeTypeWise {
    code: number;
    message: string;
    error: any[]; // You can replace 'any' with the actual type if available
    data: SchemeTypeWiseData[];
    count: number;
    filterCount: number;
}
interface SchemeTypeWiseData {
    name: string;
    currentValue: number;
    investedValue: number;
}
interface RMwise {
    code: number;
    message: string;
    error: any[]; // You can replace 'any' with the actual type if available
    data: RMwiseData[];
    count: number;
    filterCount: number;
}
interface RMwiseData {
    name: string;
    currentValue: number;
    investedValue: number;
}

interface IFAwise {
    code: number;
    message: string;
    error: any[]; // You can replace 'any' with the actual type if available
    data: IFAwiseData[];
    count: number;
    filterCount: number;
}

interface IFAwiseData {
    name: string;
    currentValue: number;
    investedValue: number;
}