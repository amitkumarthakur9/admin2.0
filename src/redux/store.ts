import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
import clientWiseDataReducer from './slices/clientsSlice';
import dataTableReducer from './slices/dataTableSlice';

export const store = configureStore({
    reducer: {
        clients: clientsReducer,
        clientWiseData: clientWiseDataReducer,
        dataTable: dataTableReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
