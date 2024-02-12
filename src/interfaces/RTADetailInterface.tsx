interface FundHouse {
  id: number;
  name: string;
  rta: {
    id: string;
    name: string;
    shortName: string | null;
  };
  logoUrl: string;
}

interface MutualFund {
  id: string;
  name: string;
  fundhouse: FundHouse;
}

interface TransactionInfo {
  id: number;
  name: string;
}

export interface TransactionMutualFund extends MutualFund {
  bseDematSchemeCode: string;
  rtaCode: string;
}

export interface Remark {
  id: number;
  remarkTypeId: number;
  remark: string;
  createdAt: Date;
  transactionId: string;
}

export interface TransactionDetail {
  id: string;
  orderReferenceNumber: string;
  amount: number;
  units: number;
  nav: number;
  paymentDate: Date | null;
  transactionType: TransactionInfo;
  settlementDate: Date;
  settlementType: string | null;
  folio: Folio;
  transactionStatus: TransactionInfo;
  Remarks: Remark[];
  account: Account;
  mutualfund: TransactionMutualFund;
  stampDuty: number;
  tax: number;
  stt: number | null;
  remainingUnits: number | null;
  allotedAmount: number;
  navAllotmentDate: Date;
  exitLoad: number | null;
  unitsUnlockDate: number | null;
  isUnitsLocked: number | null;
  createdAt: Date;
}

export interface TransactionDetailResponseInterface {
  message: string;
  error: any[];
  data: TransactionDetail;
}
