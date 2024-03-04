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


  // You can declare multiple interfaces or types here
}

// This line is necessary to make TypeScript treat this file as a module
export {};