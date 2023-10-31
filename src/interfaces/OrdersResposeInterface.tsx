import { OrderInterface } from "./OrderInterface";

export interface OrdersResponse {
    code: number;
    message: string;
    error: any[];
    orders: OrderInterface[];
    count: number;
    filterCount: number;
    totalCount: number;
}