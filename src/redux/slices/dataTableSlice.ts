import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import RemoteApi from "../../services/RemoteApi";
import { RootState } from "../store"; // Assuming this is where your store setup is

// Define initial state for the DataTable slice
interface DataTableState {
    tables: {
        [tableId: string]: {
            currentPageNumber: number;
            totalItems: number;
            itemsPerPage: number;
            data: any[];
            totalPages: number;
            appliedFilers: any[];
            filtersSchema: any[];
            sorting: any[];
            appliedSorting: { key: string; direction: string };
            isDataLoading: boolean; // For table data
            isSchemaLoading: boolean; // For schema
            error: string | null;
        };
    };
}

// Define the types for your thunk arguments
interface FetchDataArgs {
    endpoint: string;
    tableId: string;
    currentPage: number;
    filters: any;
    sorting: any;
    itemsPerPage: number;
}

interface FetchSchemaArgs {
    endpoint: string;
    tableId: string;
}

interface SchemaType {
    filters: any[]; // Adjust types based on your actual schema
    sort: any[]; // Adjust types based on your actual sorting structure
}

// Async thunk for fetching table data
export const fetchData = createAsyncThunk(
    "dataTable/fetchData",
    async ({
        endpoint,
        tableId,
        currentPage,
        filters,
        sorting,
        itemsPerPage,
    }: FetchDataArgs) => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            filters,
            orderBy: sorting,
        };
        console.log("params", params);
        const response: any = await RemoteApi.post(endpoint, params);
        return {
            tableId,
            data: response.data,
            totalItems: response.filterCount,
        };
    }
);

export const fetchSchema = createAsyncThunk(
    "dataTable/fetchSchema",
    async ({
        endpoint,
        tableId,
    }: FetchSchemaArgs): Promise<{ tableId: string; schema: SchemaType }> => {
        const response = await RemoteApi.get(endpoint);
        return { tableId, schema: response as SchemaType }; // Cast response to SchemaType
    }
);

const dataTableSlice = createSlice({
    name: "dataTable",
    initialState: {
        tables: {}, // This will hold state for multiple tables
    },
    reducers: {
        initializeTable: (
            state,
            action: PayloadAction<{ tableId: string; initialState: any }>
        ) => {
            const { tableId, initialState } = action.payload;
            if (!state.tables[tableId]) {
                state.tables[tableId] = initialState;
            }
        },
        setCurrentPageNumber: (
            state,
            action: PayloadAction<{
                tableId: string;
                currentPageNumber: number;
            }>
        ) => {
            const { tableId, currentPageNumber } = action.payload;
            state.tables[tableId].currentPageNumber = currentPageNumber;
        },
        setTotalItems: (
            state,
            action: PayloadAction<{ tableId: string; totalItems: number }>
        ) => {
            const { tableId, totalItems } = action.payload;
            state.tables[tableId].totalItems = totalItems;
        },
        setItemsPerPage: (
            state,
            action: PayloadAction<{ tableId: string; itemsPerPage: number }>
        ) => {
            const { tableId, itemsPerPage } = action.payload;
            state.tables[tableId].itemsPerPage = itemsPerPage;
        },
        setData: (
            state,
            action: PayloadAction<{ tableId: string; data: any[] }>
        ) => {
            const { tableId, data } = action.payload;
            state.tables[tableId].data = data;
        },
        setTotalPages: (
            state,
            action: PayloadAction<{ tableId: string; totalPages: number }>
        ) => {
            const { tableId, totalPages } = action.payload;
            state.tables[tableId].totalPages = totalPages;
        },
        setAppliedFilers: (
            state,
            action: PayloadAction<{ tableId: string; appliedFilers: any[] }>
        ) => {
            const { tableId, appliedFilers } = action.payload;
            state.tables[tableId].appliedFilers = appliedFilers;
        },
        setFiltersSchema: (
            state,
            action: PayloadAction<{ tableId: string; filtersSchema: any[] }>
        ) => {
            const { tableId, filtersSchema } = action.payload;
            state.tables[tableId].filtersSchema = filtersSchema;
        },
        setSorting: (
            state,
            action: PayloadAction<{ tableId: string; sorting: any[] }>
        ) => {
            const { tableId, sorting } = action.payload;
            state.tables[tableId].sorting = sorting;
        },
        setAppliedSorting: (
            state,
            action: PayloadAction<{
                tableId: string;
                appliedSorting: { key: string; direction: string };
            }>
        ) => {
            const { tableId, appliedSorting } = action.payload;
            state.tables[tableId].appliedSorting = appliedSorting;
        },
        setLoading: (
            state,
            action: PayloadAction<{ tableId: string; isLoading: boolean }>
        ) => {
            const { tableId, isLoading } = action.payload;
            state.tables[tableId].isLoading = isLoading;
        },
        setError: (
            state,
            action: PayloadAction<{ tableId: string; error: string | null }>
        ) => {
            const { tableId, error } = action.payload;
            state.tables[tableId].error = error;
        },
    },
    extraReducers: (builder) => {
        // Handle data fetching
        builder
            .addCase(fetchData.pending, (state, action) => {
                const { tableId } = action.meta.arg;
                state.tables[tableId].isDataLoading = true; // Data loading
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                const { tableId, data, totalItems } = action.payload;
                state.tables[tableId].isDataLoading = false; // Data loaded
                state.tables[tableId].data = data;
                state.tables[tableId].totalItems = totalItems;
            })
            .addCase(fetchData.rejected, (state, action) => {
                const { tableId } = action.meta.arg;
                state.tables[tableId].isDataLoading = false; // Data loading failed
                state.tables[tableId].error = action.error.message;
            });
        // Handle schema fetching
        builder
            .addCase(fetchSchema.pending, (state, action) => {
                const { tableId } = action.meta.arg;
                state.tables[tableId].isSchemaLoading = true; // Schema loading
            })
            .addCase(fetchSchema.fulfilled, (state, action) => {
                const { tableId, schema } = action.payload;
                state.tables[tableId].isSchemaLoading = false; // Schema loaded
                state.tables[tableId].filtersSchema = schema;
                state.tables[tableId].sorting = schema.sort;
            })
            .addCase(fetchSchema.rejected, (state, action) => {
                const { tableId } = action.meta.arg;
                state.tables[tableId].isSchemaLoading = false; // Schema loading failed
                state.tables[tableId].error = action.error.message;
            });
    },
});

export const {
    initializeTable,
    setCurrentPageNumber,
    setTotalItems,
    setItemsPerPage,
    setData,
    setTotalPages,
    setAppliedFilers,
    setFiltersSchema,
    setSorting,
    setAppliedSorting,
    setLoading,
    setError,
} = dataTableSlice.actions;

// Selector to access table data in the component
export const selectTableState = (state: RootState, tableId: string) =>
    state.dataTable.tables[tableId];

export default dataTableSlice.reducer;
