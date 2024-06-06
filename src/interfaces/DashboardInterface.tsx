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

interface Analytics {
    totalClient: number;
    totalActiveClient: number;
    totalTransactedClient: number;
    totalSipAmount: number;
    totalLumpsumAmount: number;
  }
  
  interface Category {
    id: number;
    name: string;
    valueResearchId: string;
  }
  
  interface AmountBreakdown {
    category: Category;
    amount: number;
  }
  
  export interface StaticDashboard {
    analytics: Analytics;
    breakdown: {
      aum: AmountBreakdown[];
      external: AmountBreakdown[];
      sip: any[]; // Assuming SIP can be an array of objects, further details needed for exact type
    };
  }
  
  export interface StaticDashboardApiResponse {
    message: string;
    error: any[];
    data: StaticDashboard;
  }
  
