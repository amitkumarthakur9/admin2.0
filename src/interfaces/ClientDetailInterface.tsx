export interface ClientDetailResponse {
    message: string;
    error: any[];
    data: ClientDetailItem;
}

export interface ClientDetailItem {

    id: string;
    name: string;
    clientId: string;
    isJointAccount: any | null;
    accountType: any | null;
    exchange: {
        id: number;
        name: string;
    };
    dematAccount: {
        id: string;
        userId: string;
        accountTypeId: number;
        dpId: string;
        boId: string;
    };
    distributorCompanyId: string;
    isActive: boolean;
    taxStatus: any | null;
    users: {
        id: string;
        name: string;
        taxStatusId: any | null;
        panNumber: string;
        isPanVerified: boolean;
        roleId: number;
        sexId: any | null;
        maritalStatusId: any | null;
        occupationId: any | null;
        adhaarNumber: any | null;
        kycStatusId: number;
        isActive: boolean;
        dateOfBirth: string; // You might want to use Date type if you plan to parse this
        politicalExposureId: string;
        isMinor: boolean;
    }[];
    nomineeOptOutDeclaration: boolean;
    bankAccountAccountLinks: {
        bankAccountId: string;
        accountId: string;
        isPrimary: boolean;
        isActive: boolean;
    }[];
    folios: any[]; // Adjust this type based on the actual data
    orders: any[]; // Adjust this type based on the actual data

}
