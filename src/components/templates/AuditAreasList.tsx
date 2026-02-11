import React, { useState } from 'react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import type { AuditArea } from '@/types/audit.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAuditArea } from '@/store/slices/auditAreasSlice';
import { addAuditArea, deleteAuditArea } from '@/store/slices/templatesSlice';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { countAuditAreaQuestions } from '@/utils/calculations';

interface AuditAreasListProps {
    auditAreas: AuditArea[];
    templateId: string;
    saving?: boolean;
}

export const AuditAreasList: React.FC<AuditAreasListProps> = ({ auditAreas, templateId, saving }) => {
    const dispatch = useAppDispatch();
    const selectedAuditAreaId = useAppSelector(state => state.auditAreas.selectedAuditAreaId);
    const [showAddArea, setShowAddArea] = useState(false);
    const [newAreaName, setNewAreaName] = useState('');
    const [areaToDelete, setAreaToDelete] = useState<string | null>(null);

    const handleSelectArea = (areaId: string) => {
        dispatch(selectAuditArea(areaId));
    };

    const handleAddArea = () => {
        if (newAreaName.trim()) {
            dispatch(addAuditArea({
                templateId,
                name: newAreaName.trim(),
            }));
            setNewAreaName('');
            setShowAddArea(false);
        }
    };

    const handleDeleteArea = () => {
        if (areaToDelete) {
            dispatch(deleteAuditArea({
                templateId,
                areaId: areaToDelete,
            }));
            if (selectedAuditAreaId === areaToDelete) {
                dispatch(selectAuditArea(null));
            }
            setAreaToDelete(null);
        }
    };

    // Auto-select first area if none selected
    React.useEffect(() => {
        if (!selectedAuditAreaId && auditAreas.length > 0) {
            dispatch(selectAuditArea(auditAreas[0].id));
        }
    }, [selectedAuditAreaId, auditAreas, dispatch]);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Audit Areas</h2>

            {/* Audit Areas List */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {auditAreas.length === 0 ? (
                    <EmptyState
                        icon={FolderOpen}
                        title="No Audit Areas"
                        description="Add audit areas to structure your template"
                        action={{
                            label: 'Add First Area',
                            onClick: () => setShowAddArea(true),
                        }}
                    />
                ) : (
                    auditAreas.map(area => {
                        const questionCount = countAuditAreaQuestions(area);
                        const isSelected = selectedAuditAreaId === area.id;

                        return (
                            <div
                                key={area.id}
                                onClick={() => handleSelectArea(area.id)}
                                className={`p-4 rounded-lg cursor-pointer transition-all group ${isSelected
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                        {area.name}
                                    </h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAreaToDelete(area.id);
                                        }}
                                        className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'hover:bg-white hover:bg-opacity-20' : 'hover:bg-red-100'
                                            }`}
                                    >
                                        <Trash2 size={16} className={isSelected ? 'text-white' : 'text-red-600'} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${isSelected ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                                            Weightage:
                                        </span>
                                        <input
                                            type="number"
                                            value={area.weightage.toFixed(1)}
                                            readOnly
                                            disabled
                                            title="Auto-calculated from questions"
                                            className={`w-20 px-2 py-1 rounded text-sm outline-none cursor-not-allowed ${isSelected
                                                ? 'bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-50'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        />
                                        <span className={`text-sm ${isSelected ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                                            %
                                        </span>
                                    </div>

                                    <div className={`text-sm ${isSelected ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                                        {area.scopes.length} scopes • {questionCount} questions
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Area Input */}
            {showAddArea && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg animate-slide-in">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audit Area Name
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddArea()}
                            placeholder="Enter area name..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            autoFocus
                        />
                        <Button variant="primary" onClick={handleAddArea} disabled={!newAreaName.trim()}>
                            Add
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            setShowAddArea(false);
                            setNewAreaName('');
                        }}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Add Audit Area Button */}
            <Button
                variant="primary"
                onClick={() => setShowAddArea(true)}
                className="w-full flex items-center justify-center gap-2"
                disabled={saving}
            >
                <Plus size={18} />
                Add Audit Area
            </Button>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={areaToDelete !== null}
                onClose={() => setAreaToDelete(null)}
                onConfirm={handleDeleteArea}
                title="Delete Audit Area"
                message="Are you sure you want to delete this audit area and all its scopes and questions?"
                confirmText="Delete"
            />
        </div>
    );
};
