export interface MutualFundDetailResponse {
    message: string;
    error: any[];
    data: FundInfo;
}

export interface FundInfo {
    name: string;
    aum: number;
    minSIPAmount: number;
    minInvestment: number;
    minAdditionalInvestment: number;
    expenseRatio: number;
    fundhouse: FundHouse;
    category: string;
    mutualfundSubcategory: string;
    dividendType: DividendType;
    optionType: OptionType;
    nav: number;
    annualReturns: number;
    threeYearAnnualReturns: number;
    fiveYearAnnualReturns: number;
    sixMonthReturns: number;
    transactions: Transaction[];
    sip: SIP[];
}

interface FundHouse {
    id: number;
    name: string;
    aum: number;
    rta: RtaInfo;
}

interface RtaInfo {
    id: number;
    name: string;
    shortName: string | null;
}

interface DividendType {
    id: number;
    name: string;
}

interface OptionType {
    id: number;
    name: string;
}

interface Transaction {
    id: string;
    account: AccountInfo;
    amount: number;
    units: number | null;
    paymentDate: string | null;
    transactionStatus: TransactionStatus;
    createdAt: string;
}

interface SIP {
    id: string;
    amount: number;
    startDate: string;
    sipReferenceNumber: string | null;
    account: AccountInfo;
    createdAt: string;
}

interface AccountInfo {
    id: string;
    clientId: string;
    name: string;
}

interface TransactionStatus {
    id: number;
    name: string;
}
