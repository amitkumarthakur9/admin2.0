interface Distributor {
    user: {
        name: string;
    };
}

interface Status {
    id: number;
    name: string;
}

interface Source {
    id: number;
    name: string;
}

interface Contact {
    id: number;
    name: string;
    distributor: Distributor;
    email: string;
    mobileNumber: string;
    status: Status;
    source: Source;
}

interface Data {
    data: Contact[];
}

interface ContactResponse {
    code: number;
    message: string;
    data: Data;
    error: any[];
    count: number;
    filterCount: number;
    totalCount: number;
}
