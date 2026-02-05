import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScopesState } from '@/types/audit.types';

const initialState: ScopesState = {
    expandedScopeIds: [],
};

const scopesSlice = createSlice({
    name: 'scopes',
    initialState,
    reducers: {
        toggleScope: (state, action: PayloadAction<string>) => {
            const index = state.expandedScopeIds.indexOf(action.payload);
            if (index > -1) {
                state.expandedScopeIds.splice(index, 1);
            } else {
                state.expandedScopeIds.push(action.payload);
            }
        },
        expandScope: (state, action: PayloadAction<string>) => {
            if (!state.expandedScopeIds.includes(action.payload)) {
                state.expandedScopeIds.push(action.payload);
            }
        },
        collapseScope: (state, action: PayloadAction<string>) => {
            state.expandedScopeIds = state.expandedScopeIds.filter(id => id !== action.payload);
        },
        collapseAllScopes: (state) => {
            state.expandedScopeIds = [];
        },
    },
});

export const { toggleScope, expandScope, collapseScope, collapseAllScopes } = scopesSlice.actions;
export default scopesSlice.reducer;
