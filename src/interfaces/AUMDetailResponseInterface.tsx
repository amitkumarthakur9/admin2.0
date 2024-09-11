interface User {
    id: string;
    panNumber: string;
    name: string; // Added 'name' property
}

interface Account {
    id: string;
    clientId: string;
    name: string;
    user: User;
    panNumber: string;
}

interface Distributor {
    distributorCompanyId: string;
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

interface MutualFundHouse {
    id: number;
    name: string;
    rta: any; // You may replace 'any' with the actual type if available
    logoUrl: string;
}
interface DeliveryType { // Added DeliveryType interface
    id: number;
    name: string;
}

interface OptionType { // Added OptionType interface
    id: number;
    name: string;
}

interface DividendType { // Added DividendType interface
    id: number;
    name: string;
}
interface MutualFund {
    id: string;
    name: string;
    fundhouse?: MutualFundHouse;
    mutualfundSubcategory?: MutualFundSubcategory;
    bseDematSchemeCode?: any; // You may replace 'any' with the actual type if available
    rtaCode?: string;
    nav?: number;
    navAsOnDate: any; // You may replace 'any' with the actual type if available
    deliveryType: DeliveryType; // Added 'deliveryType' property
    optionType: OptionType; // Added 'optionType' property
    dividendType: DividendType; // Added 'dividendType' property
    logoUrl: string;
    category: string;
    Subcategory : string;
}

interface TransactionType {
    id: number;
    name: string;
}

interface TransactionStatus {
    id: number;
    name: string;
}

interface Transaction {
    amount: number;
    units: number;
    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
    nav: any; // You may replace 'any' with the actual type if available
    navAllotmentDate: any; // You may replace 'any' with the actual type if available
    settlementDate: any; // You may replace 'any' with the actual type if available
    settlementType: any; // You may replace 'any' with the actual type if available
    paymentDate: any; // You may replace 'any' with the actual type if available
}

export interface AUMDetailInterface {
    id: string;
    folioNumber: string;
    currentValue: number;
    investedValue: number;
    units: number;
    account: Account;
    distributor: Distributor;
    mutualfund: MutualFund;
    transactions: Transaction[];
    xirr: number; // Added 'xirr' property
    redemableAmount: number; // Added 'redemableAmount' property
    redemableUnits: number; // Added 'redemableUnits' property
    avgNav: number; // Added 'avgNav' property
}

export interface AUMDetailResponseInterface {
    message: string;
    error: any[]; // You may replace 'any' with the actual type if available
    data: AUMDetailInterface;
}
