import React from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { Scope } from '@/types/audit.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleScope } from '@/store/slices/scopesSlice';
import { addQuestion, updateQuestion, deleteQuestion } from '@/store/slices/templatesSlice';
import { calculateScopeTotal } from '@/utils/calculations';

interface ScopeAccordionProps {
    scope: Scope;
    templateId: string;
    areaId: string;
    onDelete: () => void;
}

export const ScopeAccordion: React.FC<ScopeAccordionProps> = ({
    scope,
    templateId,
    areaId,
    onDelete
}) => {
    const dispatch = useAppDispatch();
    const expandedScopeIds = useAppSelector(state => state.scopes.expandedScopeIds);
    const isExpanded = expandedScopeIds.includes(scope.id);

    const scopeTotal = calculateScopeTotal(scope.questions);

    const handleToggle = () => {
        dispatch(toggleScope(scope.id));
    };

    const handleAddQuestion = () => {
        dispatch(addQuestion({
            templateId,
            areaId,
            scopeId: scope.id,
            text: 'New Question',
            percentage: 0,
        }));
    };

    const handleUpdateQuestion = (questionId: string, field: 'text' | 'percentage', value: string | number) => {
        dispatch(updateQuestion({
            templateId,
            areaId,
            scopeId: scope.id,
            questionId,
            [field]: value,
        }));
    };

    const handleDeleteQuestion = (questionId: string) => {
        dispatch(deleteQuestion({
            templateId,
            areaId,
            scopeId: scope.id,
            questionId,
        }));
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
            {/* Accordion Header */}
            <button
                onClick={handleToggle}
                className="w-full px-4 py-3 bg-primary bg-opacity-5 hover:bg-opacity-10 transition-colors flex items-center justify-between group"
            >
                <div className="flex items-center gap-3 flex-1">
                    <div className="text-primary">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    <div className="text-left flex-1">
                        <h4 className="font-semibold text-gray-900">{scope.name}</h4>
                        <p className="text-sm text-gray-600">
                            {scope.questions.length} questions • {scopeTotal.toFixed(1)}%
                        </p>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={16} className="text-red-600" />
                </button>
            </button>

            {/* Accordion Content */}
            {isExpanded && (
                <div className="p-4 bg-white animate-slide-in">
                    <div className="space-y-3">
                        {scope.questions.map((question, index) => (
                            <div key={question.id} className="flex gap-3 items-start group">
                                <span className="text-sm text-gray-500 mt-2 min-w-[24px]">{index + 1}.</span>
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={question.text}
                                        onChange={(e) => handleUpdateQuestion(question.id, 'text', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                        placeholder="Question text..."
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={question.percentage}
                                            onChange={(e) => handleUpdateQuestion(question.id, 'percentage', parseFloat(e.target.value) || 0)}
                                            className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                        />
                                        <span className="text-sm text-gray-600">%</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="p-2 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                                >
                                    <Trash2 size={16} className="text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add Question Button */}
                    <button
                        onClick={handleAddQuestion}
                        className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary hover:bg-primary hover:bg-opacity-5 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={18} />
                        Add Question
                    </button>
                </div>
            )}
        </div>
    );
};
