import { OrderInterface } from "./OrderInterface";

export interface OrdersResponse {
    code: number;
    message: string;
    error: any[];
    data: OrderInterface[];
    count: number;
    filterCount: number;
    totalCount: number;
}