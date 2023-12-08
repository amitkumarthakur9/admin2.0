interface MutualfundDeliveryType {
    mutualfundOptionType: {
        mutualfundDeliveryType: {
            mutualfund: {
                id: string;
                name: string;
                objective: string | null;
                description: string | null;
                fundhouseId: number;
                launchDate: string;
                subcategoryId: number;
                schemeInformationDocumentPath: string | null;
                minInvestment: number;
                investmentMultiple: number;
                minAdditionalInvestment: number | null;
                minRedemptionAmount: number | null;
                redemptionMultiple: number | null;
                minRedemtionQtyMultiple: number | null;
                typeId: number;
                facevalue: number;
                isSIPAllowed: number;
                isSWPAllowed: number;
                isSwitchAllowed: number | null;
                isSTPAllowed: number;
                minBalance: number | null;
                isIndex: number;
                isEtf: number;
                isFof: number;
                lockIn: number;
                isIntervalFund: number;
                statusId: number;
                isNFO: number;
                lockInPeriodDays: number | null;
                isRGESS: number;
                minRedemptionUnits: number | null;
                maxInvestmentAmount: number | null;
                aum: number | null;
                aumAsOnDate: string;
                riskId: number | null;
                high52Week: number | null;
                low52Week: number | null;
                rating: number | null;
                updatedAt: string;
                valueResearchId: string;
                load: number;
                loadNote: string | null;
                minSIPAmount: number | null;
                maxSIPAmount: number | null;
                sipMultiple: number | null;
                minSIPInstallments: number | null;
                minSWPAmount: number | null;
                maxSWPAmount: number | null;
                swpMultiple: number | null;
                minSWPInstallments: number | null;
                minSTPAmount: number | null;
                maxSTPAmount: number | null;
                stpMultiple: number | null;
                minSTPInstallments: number | null;
            };
        };
    };
}

interface Holding {
    id: string;
    userId: string;
    accountId: string;
    mutualfundDividendTypeId: string;
    xirr: number;
    avgNav: number;
    units: number;
    currentValue: number;
    investedValue: number;
    load: number | null;
    loadNote: string | null;
}

interface Folio {
    id: string;
    folioNumber: string;
    holding: Holding;
    mutualfundDividendType: MutualfundDeliveryType;
}

interface UserCredentials {
    email: string;
    mobileNumber: string;
}

interface UserAddress {
    // Define address properties here
    // name: "string"
}

interface User {
    id: string;
    taxStatus: number | null;
    panNumber: string;
    adhaarNumber: string | null;
    isPanVerified: boolean;
    userRoleType: {
        id: number;
        name: string;
    };
    sex: number | null;
    maritalStatus: number | null;
    occupation: number | null;
    kycStatus: {
        id: number;
        name: string;
        isAllowedToTransact: boolean;
    };
    isActive: boolean;
    dateOfBirth: string;
    isMinor: boolean;
    credentials: UserCredentials[];
    addresses: UserAddress[];
}

interface BankBranch {
    name: string | null;
    ifscCode: string;
    bank: {
        name: string;
    } | null;
}

interface BankAccountType {
    id: number;
    name: string;
}

interface BankAccount {
    bankBranch: BankBranch;
    micrCode: string | null;
    accountNumber: string;
    bankAccountType: BankAccountType;
    isActive: boolean;
    isPrimary: boolean;
}

interface Transaction {
    id: string;
    folioId: string;
    mutualfundDividendTypeId: string;
    orderReferenceNumber: string | null;
    amount: number;
    transactionTypeId: number;
    distributorId: string;
    orderId: string;
    transactionStatusId: number;
    accountId: string;
    settlementTypeId: string | null;
    remark: string;
    allotmentRemarks: string | null;
    rtaRemarks: string | null;
    createdAt: string;
    stampDuty: number | null;
    tax: number | null;
    stt: number | null;
    remainingUnits: number | null;
    allotedAmount: number | null;
    navAllotmentDate: string | null;
    paymentDate: string | null;
    settlementDate: string | null;
    nav: number | null;
    units: number;
    exitLoad: number | null;
}


interface Order {
    id: string;
    orderReferenceNumber: string | null;
    sipReferenceNumber: string | null;
    accountId: string;
    amount: number;
    orderTypeId: number;
    mutualfundDividendTypeId: string;
    toMutualfundDividendTypeId: string | null;
    distributorId: string;
    mandateId: string | null;
    orderStatusId: number;
    totalNoOfInstallments: number | null;
    noOfInstallmentsExecuted: number | null;
    startDate: string | null;
    endDate: string | null;
    remark: string;
    createdAt: string;
    bankAccountId: string;
    nav: number;
    units: number;
}

interface Fundhouse {
    id: number;
    name: string;
    logoUrl: string;
}

interface MutualFund {
    id: string;
    name: string;
    fundhouse: Fundhouse;
}

interface Folio {
    folioNumber: string;
}

interface Holding {
    xirr: number;
    avgNav: number;
    units: number;
    currentValue: number;
    investedValue: number;
    folios: Folio[];
    mutualfund: MutualFund;
}

interface HoldingsResponse {
    holdings: Holding[];
}

export interface ClientDetailItem {
    id: string;
    name: string;
    clientId: string;
    isJointAccount: null;
    accountType: null;
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
    taxStatus: null;
    users: User[];
    nomineeOptOutDeclaration: null;
    bankAccounts: BankAccount[];
    folios: Folio[];
    orders: Order[];
    transactions: Transaction[];
    holdings: Holding[];
}

export interface ClientDetailResponse {
    message: string;
    error: any[];
    data: ClientDetailItem;
}
