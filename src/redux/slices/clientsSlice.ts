import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import RemoteApi from '../../services/RemoteApi';

interface ClientState {
    clients: ClientDataResponse[];
    totalItems: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: ClientState = {
    clients: [],
    totalItems: 0,
    totalPages: 1,
    isLoading: false,
    error: null,
};

// Async thunk for fetching clients
export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async (data: any, { rejectWithValue }) => {
        
        try {
            const response: ApiResponse<ClientDataResponse[]> = await RemoteApi.post('client/list', data);
            if (response?.code === 200) {
                return {
                    clients: response.data,
                    totalItems: response.filterCount,
                };
            } else {
                return rejectWithValue('Failed to fetch clients');
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action: PayloadAction<{ clients: ClientDataResponse[], totalItems: number }>) => {
                state.clients = action.payload.clients;
                state.totalItems = action.payload.totalItems;
                state.totalPages = Math.ceil(action.payload.totalItems / 10); // Example for 10 items per page
                state.isLoading = false;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default clientsSlice.reducer;
