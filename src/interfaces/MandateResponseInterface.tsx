interface MandateStatus {
    id: number;
    name: string;
}

interface BankAccount {
    bankName: string | null;
    branchName: string | null;
    ifscCode: string;
    micrCode: string[]; // You may need to adjust the type based on your actual data structure
}

interface Account {
    name: string;
    clientCode: string;
}

export interface MandateDataInterface {
    id: string;
    mandateId: null | string;
    mandateStatus: MandateStatus;
    amount: number;
    bankAccount: BankAccount;
    account: Account;
}

export interface MandateResponseInterface {
    code: number;
    message: string;
    error: any[]; // You may need to adjust the type based on your actual data structure
    data: MandateDataInterface[];
    count: number;
    filterCount: number;
    totalCount: number;
}
