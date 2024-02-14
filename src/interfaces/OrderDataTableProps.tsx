import { OrderInterface } from "./OrderInterface";

export interface OrderDataTableProps {
    code: number;
    message: string;
    error: any[];
    orders: OrderInterface[];
    count: number;
    filterCount: number;
    totalCount: number;
}
