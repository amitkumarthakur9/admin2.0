interface BankAccountType {
    id: number;
    name: string;
}

interface BankAccount {
    micrCode: null | string;
    bankName: string;
    branchName: string;
    ifscCode: string;
    bankAccountType: BankAccountType;
    accountNumber: string;
    isActive: boolean;
    createdAt: string | null;
}

interface DematAccountType {
    id: number;
    name: string;
    bseCode: string;
}

interface DematAccount {
    id: string;
    dpId: string;
    boId: string;
    dematAccountType: DematAccountType;
}

interface User {
    name: string;
    panNumber: string;
}

interface Account {
    id: string;
    clientId: string;
    name: string;
    user: User[];
    dematAccount: DematAccount;
}

interface MandateStatus {
    id: number;
    name: string;
}

interface Data {
    id: string;
    mandateId: string;
    amount: number;
    startDate: string;
    endDate: string;
    bankAccount: BankAccount;
    mandateStatus: MandateStatus;
    account: Account;
}

export interface MandateDetailInterface {
    id: string;
    mandateId: string;
    amount: number;
    startDate: string;
    endDate: string;
    bankAccount: BankAccount;
    mandateStatus: MandateStatus;
    account: Account;
    createdAt: string;
}

export interface MandateDetailInterfaceResponse {
    message: string;
    error: any[]; // You may need to adjust the type based on your actual data structure
    data: MandateDetailInterface;
}
