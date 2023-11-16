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
}

interface Mandate {
    id: string;
    mandateId: string;
    mandateStatus: {
        id: number;
        name: string;
    };
    bankAccount: BankAccount;
}

interface OrderStatus {
    id: number;
    name: string;
}

interface Folio {
    folioNumber: string;
}

interface Transaction {
    folio: Folio;
}

interface MutualFundSubcategory {
    id: number;
    name: string;
    mutualfundCategory: {
        id: number;
        name: string;
    };
}

interface MutualFund {
    id: string;
    name: string;
    mutualfundSubcategory: MutualFundSubcategory;
}

interface Account {
    id: string;
    clientId: string;
    name: string;
    users: {
        id: string;
        name: string;
    }[];
}

export interface SIPReportDetail {
    id: string;
    account: Account;
    distributor: {
        distributorCompanyId: string;
    };
    units: number;
    amount: number;
    startDate: string;
    endDate: string;
    sipReferenceNumber: string;
    orderStatus: OrderStatus;
    mandate?: Mandate;
    noOfInstallmentsExecuted: number;
    totalNoOfInstallments: number;
    transactions: Transaction[];
    mutualfund: MutualFund;
    toMutualfund: MutualFund;
}

export interface SIPDetailResponseInterface {
    message: string;
    error: any[];
    data: SIPReportDetail;
}


