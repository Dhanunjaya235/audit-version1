import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Edit2, Trash2, FileText } from 'lucide-react';
import type { Template } from '@/types/audit.types';
import { useAppDispatch } from '@/store/hooks';
import { cloneTemplate, deleteTemplate } from '@/store/slices/templatesSlice';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { countTemplateQuestions } from '@/utils/calculations';

interface TemplateCardProps {
    template: Template;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const totalAreas = template.auditAreas.length;
    const totalQuestions = countTemplateQuestions(template);
    const totalWeightage = template.auditAreas.reduce((sum, area) => sum + area.weightage, 0);

    const handleClone = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(cloneTemplate(template.id));
    };
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/templates/${template.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        dispatch(deleteTemplate(template.id));
    };

    const handleCardClick = () => {
        navigate(`/templates/${template.id}`);
    };

    return (
        <>
            <div
                className="bg-white rounded-xl shadow-md p-6 cursor-pointer card-hover relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleCardClick}
            >
                {/* Template Icon */}
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="text-primary" size={24} />
                </div>

                {/* Template Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary transition-colors">
                    {template.name}
                </h3>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Audit Areas</span>
                        <span className="font-semibold text-gray-900">{totalAreas}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total Questions</span>
                        <span className="font-semibold text-gray-900">{totalQuestions}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total Weightage</span>
                        <span className={`font-semibold ${Math.abs(totalWeightage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalWeightage.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Weightage Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                    <div
                        className={`h-full transition-all duration-500 ${Math.abs(totalWeightage - 100) < 0.01 ? 'bg-green-500' : 'bg-primary'
                            }`}
                        style={{ width: `${Math.min(totalWeightage, 100)}%` }}
                    />
                </div>

                {/* Action Icons - Show on hover */}
                <div
                    className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <button
                        onClick={handleClone}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 hover:scale-110 transition-all"
                        title="Clone Template"
                    >
                        <Copy size={18} className="text-gray-600" />
                    </button>
                    <button
                        onClick={handleEdit}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 hover:scale-110 transition-all"
                        title="Edit Template"
                    >
                        <Edit2 size={18} className="text-gray-600" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 hover:scale-110 transition-all"
                        title="Delete Template"
                    >
                        <Trash2 size={18} className="text-red-600" />
                    </button>
                </div>

                {/* Last Updated */}
                <p className="text-xs text-gray-500 mt-2">
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                </p>
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Delete Template"
                message={`Are you sure you want to delete "${template.name}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </>
    );
};
