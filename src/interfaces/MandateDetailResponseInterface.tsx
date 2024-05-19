interface Fundhouse {
    id: number;
    name: string;
    aum: number;
    rta: {
        id: number;
        name: string;
        shortName: string | null;
    };
}

interface Transaction {
    id: string;
    account: {
        id: string;
        clientId: string;
        name: string;
    };
    amount: number;
    units: null; // Adjust if units can be present
    paymentDate: null; // Adjust if payment date can be present
    transactionStatus: {
        id: number;
        name: string;
    };
    createdAt: string;
}

interface Sip {
    id: string;
    amount: number;
    startDate: string;
    sipReferenceNumber: string;
    account: {
        id: string;
        name: string;
        clientId: string;
    };
    createdAt: string;
}

interface FundDetail {
    name: string;
    aum: number;
    minSIPAmount: number;
    minInvestment: number;
    minAdditionalInvestment: number;
    fundhouse: Fundhouse;
    transactions: Transaction[];
    sip: Sip[];
}

export interface MandateDetailInterface {
    message: string;
    error: any[]; // You may need to adjust the type based on your actual data structure
    data: FundDetail;
}

interface BankAccountType {
    id: number;
    name: string;
    bseCode: string;
}

interface BankAccount {
    micrCode: string | null;
    bankName: string;
    branchName: string;
    ifscCode: string;
    bankAccountType: BankAccountType;
    accountNumber: string;
    isActive: boolean;
    createdAt: string;
}

interface MandateStatus {
    id: number;
    name: string;
}

interface Account {
    id: string;
    clientCode: string;
    name: string;
    panNumber: string;
}

export interface MandateDetailInterfaceResponse {
    message: string;
    error: any[]; // Assuming error can be any type of array
    data: {
        id: string;
        mandateId: string;
        amount: number;
        startDate: string;
        endDate: string;
        bankAccount: BankAccount;
        mandateStatus: MandateStatus;
        account: Account;
        orders: any[]; // Assuming orders can be any type of array
        createdAt: string;
    };
}
