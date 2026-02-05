import { configureStore } from '@reduxjs/toolkit';
import templatesReducer from '@/store/slices/templatesSlice';
import auditAreasReducer from '@/store/slices/auditAreasSlice';
import scopesReducer from '@/store/slices/scopesSlice';

export const store = configureStore({
    reducer: {
        templates: templatesReducer,
        auditAreas: auditAreasReducer,
        scopes: scopesReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
