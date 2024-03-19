interface TransactionStatusDetail {
    id: number;
    name: string;
}

interface Transaction {
    id: string;
    amount: number;
    units: number;
    paymentDate: string | null;
    transactionStatus: TransactionStatusDetail;
    createdAt: string;
}

interface Folio {
    id: string;
    folioNumber: string;
    currentValue: number;
    investedValue: number;
}

interface MutualFundDetail {
    id: string;
    name: string;
    dividentType: string;
    optionType: string;
    deliveryType: string;
    rta: string;
    logoUrl: string;
    category: string;
    subCategory: string;
}

interface Account {
    id: string;
    clientId: string;
    name: string;
    panNumber: string;
}

export interface HoldingDetailData {
    id: string;
    currentValue: number;
    investedValue: number;
    units: number;
    xirr: number;
    mutualfund: MutualFundDetail;
    account: Account;
    folios: Folio[];
    transactions: Transaction[];
}

export interface HoldingDetailResponse {
    message: string;
    error: any[]; // You might want to define an interface for error objects as well
    data: HoldingDetailData;
}
