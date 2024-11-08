/// <reference types="nativewind/types" />
declare module "*.css";

declare global {
    interface ApiResponse<T> {
        code: number;
        message: string;
        error: any[];
        data: T;
        count: number;
        filterCount: number;
        totalCount: number;
        errors: []
    }

    interface ErrorResponse {
        code: number;
        success: boolean;
        message: string;
        data: any[]; // Depending on the response, this might be an array of specific types
        errors: {
            message: string;
        }[];
    }

    interface ManagementUsers{
        id: string;
            name: string;

    }

    interface errors {
        message: string;
    }
    interface ClientDataResponse {
        id: string;
        name: string;
        clientCode: string;
        kycStatus?: string;
        panNumber?: string;
        isActive: boolean;
        distributor: {
            id: string;
            name: string;
            managementUsers: ManagementUsers;
        };
        lastInvestment: string;
        externalFundLastUpdatedOn: string;
        activeSip: number;
        errors: [];
    }

    interface ClientDetailedDataResponse {
        id: string;
        name: string;
        clientId: string;
        isJointAccount: boolean;
        nominee: any[];
        dematAccount: DematAccount;
        taxStatus: TaxStatus;
        users: User[];
        holdings: Holding[];
        sipOrders: SIPOrder[];
        transactions: Transaction[];
        bankAccounts: BankAccount[];
        isActive: boolean;
        externalFundLastUpdatedOn: string | null;
    }

    interface ClientExternalFolioData {
        id: string;
        folioNumber: string;
        investedValue: number;
        currentValue: number;
        units: number;
        redeemableAmount: number;
        redeemableUnits: number;
    }     
      interface ClientExternalApiResponse {
        message: string;
        error: any[];
        data: ClientExternalFolioData[];
      }

    interface BankAccount {
        accountNumber: string;
        accountType: string;
        branchName: string;
        ifscCode: string;
        micrCode: any[];
        bankName: string;
        mandates: Mandate[];
    }

    interface Mandate {
        mandateStatus: DeliveryType;
        mandateType: DeliveryType;
        amount: number;
        startDate: string;
        endDate: string;
    }

    interface DeliveryType {
        id: number;
        name: string;
    }

    interface DematAccount {
        id: string;
        dematAccountType: DematAccountType;
        dpId: string;
        boId: string;
    }

    interface DematAccountType {
        id: number;
        name: string;
        bseCode: string;
    }

    interface Holding {
        id: string;
        investedValue: number;
        currentValue: number;
        xirr: number;
        units: number;
        mutualfund: HoldingMutualfund;
        isExternal: boolean;
    }

    interface HoldingMutualfund {
        id: string;
        name: string;
        type: Type;
        logoUrl: string;
        dividendType: DeliveryType;
        optionType: DeliveryType;
        deliveryType: DeliveryType;
        category: string;
        subCategory: string;
        maxInvestment: number;
        minAdditionalInvestment: number;
        minInvestment: number;
        loadNote: string | null;
        low52Week: number;
        high52Week: number;
    }

    enum Type {
        OpenEnded = "Open-ended",
    }

    interface SIPOrder {
        id: string;
        amount: number;
        startDate: string;
        endDate: string;
        mutualfund: HoldingMutualfund;
    }

    interface TaxStatus {
        id: string;
        name: string;
        code: string;
    }

    interface Transaction {
        id: string;
        amount: number;
        transactionType: TransactionType;
        transactionStatus: TransactionStatus;
        paymentDate: string;
        mutualfund: HoldingMutualfund;
    }

    enum TransactionStatus {
        Alloted = "Alloted",
        Approved = "Approved",
        Failed = "Failed",
        Placed = "Placed",
        Registered = "Registered",
    }

    enum TransactionType {
        Purchase = "Purchase",
        Redemption = "Redemption",
    }

    interface User {
        name: string;
        kycStatus: KycStatus;
        panNumber: string;
        dateOfBirth: string;
        email: string;
    }

    interface KycStatus {
        id: number;
        name: string;
        isAllowedToTransact: boolean;
    }

    interface MutualFundSearchResult {
        id: string;
        name: string;
        mutualfundType: {
            id: number;
            name: string;
        };
        logoUrl: string | null;
        nav: number | null;
        rating: number;
        optionType: {
            id: number;
            name: string;
            mutualfundDividendType: {
                id: string;
                dividendType: {
                    id: number;
                    name: string;
                };
            }[];
        }[];
        category: {
            name: string;
        };
        subCategory: {
            name: string;
            mutualfundCategory: {};
        };
        maxInvestment: number;
        minAdditionalInvestment: number;
        minInvestment: number;
        low52Week: any;
        high52Week: any;
    }

    interface FolioSchema {
        id: string;
        folioNumber: string;
        investedValue: number;
        currentValue: number;
        redeemableAmount: number;
        redeemableUnits: number;
        mutualfundDividendType: {
            mutualfundOptionType: {
                mutualfundDeliveryType: {
                    mutualfund: {
                        name: string;
                        fundhouseId: number;
                        isSwitchAllowed: boolean;
                        high52Week: number;
                        low52Week: number;
                        load: number | null;
                        loadNote: string | null;
                    };
                };
            };
        };
        transactions: {
            isUnitsLocked: boolean;
        }[];
    }


    interface ArnImport {
        message: string;
        error: any[]; // Change the type of error array if it has a specific structure
        data: string;
    }
    

    interface BrokerageResponse {
        totalAmount: number;
        subBrokerAmount: number;
        distributorAmount: number;
        sipTotal: number;
        oneTimeTotal: number;
        topFundhouse: TopFundhouse[];
    }

    interface TopFundhouse {
        fundhouse: string;
        totalAmount: number;
        subBrokerAmount: number;
        distributorAmount: number;
    }

    interface BrokerageTopClientsResponse {
        account: DeliveryType;
        totalAmount: number;
        subBrokerAmount: number;
        distributorAmount: number;
    }

    interface ClientBrokerageTransaction {
        id: string;
        amount: number;
        account: DeliveryType;
        mutualfund: {
            dividendType: DeliveryType;
            optionType: DeliveryType;
            deliveryType: DeliveryType;
            name: string;
            logoUrl: string;
            category: string;
            subCategory: string;
        };
        totalAmount: number;
        subBrokerAmount: number;
        distributorAmount: number;
    }
    interface DropdownList {
        id: number;
        name: string;
    }

    interface DropdownResponse {
        code: number;
        message: string;
        errors: any[];
        data: DropdownList[];
    }

    interface CancelSIP {
        code: number;
        message: string;
        data: {
            cxlLastUpdatedAt: string;
            autoCxlLastUpdatedAt: string;
        };
        errors: any[];
    }

    interface SIPCancelUpload {
        code: number;
        message: string;
        errors: any[];
        data: string;
    }
    
    
    


    // You can declare multiple interfaces or types here
}

// This line is necessary to make TypeScript treat this file as a module
export {};
