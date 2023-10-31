import { ClientInterface } from "./ClientInterface";

export interface ReportDataTableProps {
    title?: string;
    statusCode?: number;
    totalItems?: number;
    itemsPerPage?: number;
    data: ClientInterface[];
}