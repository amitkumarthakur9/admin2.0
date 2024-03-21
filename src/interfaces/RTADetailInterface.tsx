interface FundHouse {
    id: number;
    name: string;
    rta: {
        id: string;
        name: string;
        shortName: string | null;
    };
    logoUrl: string;
}

interface MutualFund {
    id: string;
    name: string;
    fundhouse: FundHouse;
    optionType: {
        id: string;
        name: string;
    };
    dividendType: {
        id: string;
        name: string;
    };
    logoUrl: string;
    category: string;
    subCategory: string;
    rta: string;
}

interface TransactionInfo {
    id: number;
    name: string;
}

export interface TransactionMutualFund extends MutualFund {
    bseDematSchemeCode: string;
    rtaCode: string;
}

export interface Remark {
    id: number;
    remarkTypeId: number;
    remark: string;
    createdAt: Date;
    transactionId: string;
}

export interface Folio {
    id: string;
    folioNumber: string;
}

export interface Account {
    id: string;
    clientId: string;
    name: string;
    user: {
        panNumber: string;
    }[];
}

export interface TransactionDetail {
    id: string;
    bseOrderNumber: string;
    amount: number;
    units: number;
    nav: number;
    paymentDate: Date | null;
    transactionType: TransactionInfo;
    settlementDate: Date;
    settlementType: string | null;
    folio: Folio;
    transactionStatus: TransactionInfo;
    Remarks: Remark[];
    account: Account;
    order: {
        id: string;
        orderType: {
            id: number;
            name: string;
        };
    };
    bank: {
        accountNumber: string;
        bankAccountType: {
            id: number;
            name: string;
            bseCode: string | null;
        };
        ifscCode: string;
        micrCode: any[];
        branchName: string;
        bankName: string;
        logoUrl: string;
    };
    mutualfund: TransactionMutualFund;
    stampDuty: number;
    tax: number;
    stt: number | null;
    allotedAmount: number;
    navAllotmentDate: Date;
    createdAt: Date;
}

export interface TransactionDetailResponseInterface {
    message: string;
    error: any[];
    data: TransactionDetail;
}
