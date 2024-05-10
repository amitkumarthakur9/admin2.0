export interface ManagementUsers{
    name: string;

}

export interface Investor {
    id: string;
    name: string;
    panNumber: string;
    arn: string;
    euin: string;
    activeAccountCount: number;
    activeSipCount: number;
    managementUsers: ManagementUsers[];
}

export interface IfaListResponse {
    code: number;
    message: string;
    error: any[];
    data: Investor[];
    count: number;
    filterCount: number;
    totalCount: number;
}


export interface AumData {
    total: number;
    breakDown: {
        category: string;
        currentValue: number;
    }[];
}

export interface TransactionData {
    purchase: number;
    redemption: number;
    totalSipTransactions: number;
    totalSipTransactionsFailed: number;
}

export interface OrderData {
    lumpsum: {
        total: number;
    };
    sip: {
        monthlySipAmount: number;
        sipCount: number;
        breakDown: {
            category: string;
            count: number;
        }[];
        newSip: number;
    };
}

export interface IFADetailData{
    aum: AumData;
    clientCount: number;
    transaction: TransactionData;
    order: OrderData;
};

export interface IfaDetailResponse {
    code: number;
    message: string;
    error: any[];
    data: IFADetailData;
}

