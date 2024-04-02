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
    filterCount: number;
    totalCount: number;
    error: any[];
    count: number;
}

interface ContactResponse {
    code: number;
    message: string;
    data: Data;
  
   
    
}
