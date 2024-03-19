interface Account {
    id: string;
    clientId: string;
    name: string;
}

interface Client {
    id: string;
    clientId: string;
    name: string;
}

interface OrderStatus {
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
}

interface Mandate {
    id: string;
    mandateId: string;
    mandateStatus: OrderStatus;
    bankAccount: BankAccount;
}

interface Folio {
    folioNumber: string;
}

interface Transaction {
    folio: Folio;
}

interface dividendType {
    id: number;
    name: string;
    
}

interface deliveryType
{
    id: number;
    name: string;
    
}

interface optionType {
    id: number;
    name: string;
    
}
interface MutualFund {
    id: string;
    name: string;
    dividendType: dividendType;
    optionType: optionType;
    deliveryType: deliveryType;
}

interface SIPReportItems {
    id: string;
    account: Account;
    units: number | null;
    amount: number;
    startDate: string | null;
    sipReferenceNumber: string | null;
    orderStatus: OrderStatus;
    mandate: Mandate | null;
    noOfInstallmentsExecuted: number | null;
    totalNoOfInstallments: number | null;
    transactions: Transaction[];
    mutualfund: MutualFund;
    clientId: string;
    client: Client;
    bankAccount: BankAccount;
}

interface SIPResponseInterface {
    code: number;
    message: string;
    error: any[];
    data: SIPReportItems[];
    count: number;
    filterCount: number;
    totalCount: number;
}
