/// <reference types="nativewind/types" />
declare module "*.css";

declare global {
    interface ApiResponse<T> {
        code:        number;
        message:     string;
        error:       any[];
        data:        T;
        count:       number;
        filterCount: number;
        totalCount:  number;
    }

    interface ClientDataResponse {
        id:         string;
        name:       string;
        clientCode: string;
        kycStatus?: string;
        panNumber?: string;
        isActive:   boolean;
    }

    interface ClientDetailedDataResponse {
        id:             string;
        name:           string;
        clientId:       string;
        isJointAccount: boolean;
        nominee:        any[];
        dematAccount:   DematAccount;
        taxStatus:      TaxStatus;
        users:          User[];
        holdings:       Holding[];
        sipOrders:      SIPOrder[];
        transactions:   Transaction[];
        bankAccounts:   BankAccount[];
        isActive:       boolean;
    }

    interface BankAccount {
        accountNumber: string;
        accountType:   string;
        branchName:    string;
        ifscCode:      string;
        micrCode:      any[];
        bankName:      string;
        mandates:      Mandate[];
    }

    interface Mandate {
        mandateStatus: DeliveryType;
        mandateType:   DeliveryType;
        amount:        number;
        startDate:     string;
        endDate:       string;
    }

    interface DeliveryType {
        id:   number;
        name: string;
    }

    interface DematAccount {
        id:               string;
        dematAccountType: DematAccountType;
        dpId:             string;
        boId:             string;
    }

    interface DematAccountType {
        id:      number;
        name:    string;
        bseCode: string;
    }

    interface Holding {
        id:            string;
        investedValue: number;
        currentValue:  number;
        xirr:          number;
        units:         number;
        mutualfund:    Mutualfund;
    }

    interface Mutualfund {
        name:         string;
        type:         Type;
        logoUrl:      string;
        dividendType: DeliveryType;
        optionType:   DeliveryType;
        deliveryType: DeliveryType;
        category:     string;
        subCategory:  string;
    }

    enum Type {
        OpenEnded = "Open-ended",
    }

    interface SIPOrder {
        id:         string;
        amount:     number;
        startDate:  string;
        endDate:    string;
        mutualfund: Mutualfund;
    }

    interface TaxStatus {
        id:   string;
        name: string;
        code: string;
    }

    interface Transaction {
        id:                string;
        amount:            number;
        transactionType:   TransactionType;
        transactionStatus: TransactionStatus;
        mutualfund:        Mutualfund;
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
        name:      string;
        kycStatus: KycStatus;
        panNumber: string;
        dateOfBirth: string;
    }

    interface KycStatus {
        id:                  number;
        name:                string;
        isAllowedToTransact: boolean;
    }

  // You can declare multiple interfaces or types here
}

// This line is necessary to make TypeScript treat this file as a module
export {};