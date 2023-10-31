import { ClientInterface } from "./ClientInterface";

export interface ClientDataTableProps {
    title?: string;
    statusCode?: number;
    totalItems?: number;
    itemsPerPage?: number;
    data: ClientInterface[];
}