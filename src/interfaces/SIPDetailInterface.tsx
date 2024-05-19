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
    logoUrl?: string;
    rta: any; // Adjust the type based on the actual structure of "rta"
}

interface optionType {
    id: number;
    name: string;

}

interface deliveryType {
    id: number;
    name: string;

}

interface dividendType {
    id: number;
    name: string;

}

interface MutualFund {
    id: string;
    name: string;
    fundhouse: Fundhouse;
    mutualfundSubcategory: MutualfundSubcategory;
    logoUrl: string;
    category: string;
    optionType: optionType;
    deliveryType: deliveryType;
    dividendType: dividendType;
    subCategory: string;
}

interface User {
    id: string;
    name: string;
    panNumber: string | null;
}

interface Account {
    id: string;
    clientId: string;
    name: string;
    user: User[];
    panNumber: string;
}

interface OrderStatus {
    id: number;
    name: string;
}

interface Distributor {
    distributorCompanyId: string;
}
interface TransactionStatus {
    id: number;
    name: string;
}

interface TransactionType {
    id: number;
    name: string;
}

interface Folio {
    folioNumber: string;
}
interface Transaction {
    nav: any; // Replace 'any' with the appropriate type if known
    amount: number;
    units: number;
    paymentDate: any; // Replace 'any' with the appropriate type if known
    settlementDate: any; // Replace 'any' with the appropriate type if known
    navAllotmentDate: any; // Replace 'any' with the appropriate type if known
    transactionStatus: TransactionStatus;
    transactionType: TransactionType;
    folio?: Folio;
    createdAt: string;
    settlementType: string;
}

interface accountType{
    id: number;
    name: string;

}
interface BankAccount {
    id: string;
    userId: string;
    branchId: string;
    micrCode: string | null;
    bankAccountTypeId: number;
    accountNumber: string;
    isActive: boolean;
    createdAt: string;
    isPrimary: boolean | null;
    branchName: string;
    ifscCode: string;
    accountType: accountType;
    bankName: string;
    logoUrl: string;
}

export interface SIPReportDetail {
    createdAt: string;
    id: string;
    account: Account;
    distributor: Distributor;
    units: number | null;
    amount: number;
    startDate: string;
    endDate: string;
    sipReferenceNumber: string;
    orderStatus: OrderStatus;
    mandate: any; // Adjust the type based on the actual structure of "mandate"
    noOfInstallmentsExecuted: number;
    totalNoOfInstallments: number;
    transactions?: Transaction[];
    mutualfund: MutualFund;
    bankAccount: BankAccount;
}
export interface SIPDetailResponseInterface {
    message: string;
    error: any[]; // Adjust the type based on the actual structure of "error"
    data: SIPReportDetail;
}
