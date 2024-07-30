export interface SIPData {
    id: string;
    name: string;
    canceledSipAmount: number;
    canceledSipCount: number;
    successSipAmount: number;
    successSipCount: number;
    failedSipAmount: number;
    failedSipCount: number;
}

export interface MutualSIPAnalytics {
    message: string;
    error: any[];
    data: SIPData[];
}


