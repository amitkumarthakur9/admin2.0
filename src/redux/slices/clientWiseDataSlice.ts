import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import RemoteApi from '../../services/RemoteApi';

export interface ClientWiseData {
  id: string;
  name: string;
  clientId: string;
  panNumber: string;
  investedValue: number;
  currentValue: number;
  xirr: number;
  distributor?: {
    name: string;
    managementUsers?: { name: string }[];
  };
}

export interface ClientWiseState {
  data: ClientWiseData[]; // Ensure 'data' is part of the state
  isLoading: boolean;
  currentPageNumber: number;
  totalItems: number;
  itemsPerPage: number;
  appliedFilters: any[];
  sorting: any[];
  appliedSorting: { key: string; direction: string };
}

const initialState: ClientWiseState = {
  data: [], // Initialize 'data' as an empty array
  isLoading: false,
  currentPageNumber: 1,
  totalItems: 0,
  itemsPerPage: 10,
  appliedFilters: [],
  sorting: [],
  appliedSorting: { key: '', direction: '' },
};

// Thunk for fetching data
export const fetchClientWiseData = createAsyncThunk(
  'clientWise/fetchData',
  async (data: any, { rejectWithValue }) => {
    try {
      const response: any = await RemoteApi.post('aum/client/list', data);
      if (response.code === 200) {
        return {
          data: response.data, // Return 'data' as part of the payload
          filterCount: response.filterCount,
        };
      } else {
        return rejectWithValue('Failed to fetch clients');
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const clientWiseDataSlice = createSlice({
  name: 'clientWise',
  initialState,
  reducers: {
    setSorting: (state, action) => {
      state.appliedSorting = action.payload;
    },
    setCurrentPageNumber: (state, action) => {
      state.currentPageNumber = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setFilters: (state, action) => {
      state.appliedFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClientWiseData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchClientWiseData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload.data; // Update 'data' in the state
      state.totalItems = action.payload.filterCount;
    });
    builder.addCase(fetchClientWiseData.rejected, (state, action) => {
      state.isLoading = false;
      console.error('Data fetch failed:', action.payload);
    });
  },
});

export const { setSorting, setCurrentPageNumber, setItemsPerPage, setFilters } =
  clientWiseDataSlice.actions;

export default clientWiseDataSlice.reducer;
