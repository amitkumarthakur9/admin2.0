interface KYCStatus {
    id: number;
    name: string;
    isAllowedToTransact: boolean;
}

interface Distributor {
    id: string;
    name: string;
    contactNumbers: string[];
}

interface DematAccount {
    id: string;
    userId: string;
    accountTypeId: number;
    dpId: string;
    boId: string;
}

interface Exchange {
    id: number;
    name: string;
}

interface User {
    id: string;
    kycStatus: KYCStatus;
    panNumber: string;
    isActive: boolean;
}

interface DistributorCompany {
    id: string;
    name: string;
}

interface Account {
    id: string;
    name: string;
    dematAccount: DematAccount;
    clientId: string;
    exchange: Exchange;
    distributor: Distributor;
    users: User[];
    distributorCompany: DistributorCompany;
    isActive: boolean;
    taxStatusId: string | null;
}

interface AccountsResponse {
    code: number;
    message: string;
    error: any[];
    data: Account[];
    count: number;
    filterCount: number;
    totalCount: number;
}
