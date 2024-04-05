interface AUMData {
    total: number;
    breakDown: AUMCategory[];
}

interface AUMCategory {
    category: string;
    currentValue: number;
}

interface TransactionData {
    purchase: number;
    redemption: number;
    totalSipTransactions: number;
    totalSipTransactionsFailed: number;
}

interface OrderData {
    lumpsum: {
        total: number | null;
    };
    sip: {
        monthlySipAmount: number | null;
        sipCount: number;
        breakDown: OrderCategory[];
        newSip: number;
    };
}

interface OrderCategory {
    category: string;
    count: number;
}

export interface DashboardData{
    id:number,
    name: string;
    panNumber: string;
    arn: string;
    euin: string;
    aum: AUMData;
        clientCount: number;
        transaction: TransactionData;
        order: OrderData;


}

export interface DashboardResponse {
    message: string;
    error: any[]; // Assuming the error array can contain any type of error data
    data: DashboardData;
}
