export interface SIPDetailResponseInterface {
    message: string;
    error: any[];
    data: SIPReportDetail
}

export interface SIPReportDetail {
    id: string;
    account: {
        id: string;
        clientId: string;
        name: string;
        users: {
            id: string;
            name: string;
        }[];
    };
    distributor: {
        distributorCompanyId: string;
    };
    units: number | null;
    amount: number;
    startDate: string | null;
    endDate: string | null;
    sipReferenceNumber: string | null;
    orderStatus: {
        id: number;
        name: string;
    };
    mandate: any | null; // Adjust this type based on the actual data
    noOfInstallmentsExecuted: number | null;
    totalNoOfInstallments: number;
    transactions: any[]; // Adjust this type based on the actual data
    mutualfund: {
        id: string;
        name: string;
        mutualfundSubcategory: {
            id: number;
            name: string;
            mutualfundCategory: {
                id: number;
                name: string;
            };
        };
    };
};