import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuditAreasState } from '@/types/audit.types';

const initialState: AuditAreasState = {
    selectedAuditAreaId: null,
};

const auditAreasSlice = createSlice({
    name: 'auditAreas',
    initialState,
    reducers: {
        selectAuditArea: (state, action: PayloadAction<string | null>) => {
            state.selectedAuditAreaId = action.payload;
        },
    },
});

export const { selectAuditArea } = auditAreasSlice.actions;
export default auditAreasSlice.reducer;
