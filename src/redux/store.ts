import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
import clientWiseDataReducer from './slices/clientsSlice';
import dataTableReducer from './slices/dataTableSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        clients: clientsReducer,
        clientWiseData: clientWiseDataReducer,
        dataTable: dataTableReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
