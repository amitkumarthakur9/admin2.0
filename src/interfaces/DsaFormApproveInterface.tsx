export interface UserMeData {
    code: number;
    message: string;
    data: UserDataDetails;
    errors: any[];
}

interface UserDataDetails {
    name: string;
    email: string;
    mobileNumber: string;
    maritalStatus: MaritalStatus;
    panNumber: string;
    arn: string;
    euin: string;
    dsaCode: string | null;
    remark: Remark;
    incomeSlab: IncomeSlab;
    isOnBoarded: boolean;
    isEsigned: boolean;
    areDocumentsUploaded: boolean;
    educationalQualification: EducationalQualification;
    bankAccount: BankAccount[];
    address: Address[];
    nameError: boolean;
    emailError: boolean;
    mobileNumberError: boolean;
    arnNumberError: boolean;
    euinNumberError: boolean;
    addressLineError: boolean;
    countryError: boolean;
    stateError: boolean;
    cityError: boolean;
    pinCodeError: boolean;
    panError: boolean;
    esignedDocumentError: boolean;
    aadharFrontDocumentError: boolean;
    aadharBackDocumentError: boolean;
    panCardDocumentError: boolean;
    cancelledChequeError: boolean;
    arnValidTill: string;
}

interface MaritalStatus {
    id: number;
    name: string;
}

interface Remark {
    id: number;
    remark: string | null;
}

interface IncomeSlab {
    id: number;
    name: string;
}

interface EducationalQualification {
    id: number;
    name: string;
}

interface BankAccount {
    id: string;
    accountNumber: string;
    bankAccountType: BankAccountType;
    bankBranch: BankBranch;
    bank: Bank;
}

interface BankAccountType {
    id: number;
    name: string;
}

interface BankBranch {
    ifscCode: string;
}

interface Bank {
    id: string;
    name: string;
}

interface Address {
    line1: string;
    line2: string;
    line3: string | null;
    pincode: string;
    district: District;
    state: State;
}

interface District {
    id: string;
    name: string;
}

interface State {
    id: number;
    name: string;
}
