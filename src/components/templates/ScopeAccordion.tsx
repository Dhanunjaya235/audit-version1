import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Settings2, X } from 'lucide-react';
import type { Scope, QuestionOption } from '@/types/audit.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleScope } from '@/store/slices/scopesSlice';
import {
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addQuestionOption,
    updateQuestionOption,
    deleteQuestionOption
} from '@/store/slices/templatesSlice';
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
    const [expandedOptionsQuestionId, setExpandedOptionsQuestionId] = useState<string | null>(null);

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

    const handleAddOption = (questionId: string) => {
        dispatch(addQuestionOption({
            templateId,
            areaId,
            scopeId: scope.id,
            questionId,
            label: 'New Option',
            value: 0,
        }));
    };

    const handleUpdateOption = (questionId: string, optionId: string, field: 'label' | 'value', value: string | number) => {
        dispatch(updateQuestionOption({
            templateId,
            areaId,
            scopeId: scope.id,
            questionId,
            optionId,
            [field]: value,
        }));
    };

    const handleDeleteOption = (questionId: string, optionId: string) => {
        dispatch(deleteQuestionOption({
            templateId,
            areaId,
            scopeId: scope.id,
            questionId,
            optionId,
        }));
    };

    const toggleOptionsPanel = (questionId: string) => {
        setExpandedOptionsQuestionId(
            expandedOptionsQuestionId === questionId ? null : questionId
        );
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
                    <div className="space-y-4">
                        {scope.questions.map((question, index) => (
                            <div key={question.id} className="border border-gray-100 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex gap-3 items-start group">
                                    <span className="text-sm font-medium text-primary mt-2 min-w-[28px] h-7 flex items-center justify-center bg-primary bg-opacity-10 rounded-full">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            value={question.text}
                                            onChange={(e) => handleUpdateQuestion(question.id, 'text', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm font-medium"
                                            placeholder="Question text..."
                                        />
                                        <div className="flex gap-3 items-center flex-wrap">
                                            <div className="flex gap-2 items-center">
                                                <label className="text-xs text-gray-500 font-medium">Weight:</label>
                                                <input
                                                    type="number"
                                                    value={question.percentage}
                                                    onChange={(e) => handleUpdateQuestion(question.id, 'percentage', parseFloat(e.target.value) || 0)}
                                                    className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                                    placeholder="0"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                />
                                                <span className="text-sm text-gray-600">%</span>
                                            </div>
                                            <button
                                                onClick={() => toggleOptionsPanel(question.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${expandedOptionsQuestionId === question.id
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Settings2 size={14} />
                                                Options ({question.options?.length || 0})
                                            </button>
                                        </div>

                                        {/* Options Panel */}
                                        {expandedOptionsQuestionId === question.id && (
                                            <div className="mt-3 p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-100 animate-slide-in">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
                                                        Answer Options
                                                    </h5>
                                                    <button
                                                        onClick={() => setExpandedOptionsQuestionId(null)}
                                                        className="p-1 hover:bg-white rounded-lg transition-colors"
                                                    >
                                                        <X size={14} className="text-gray-500" />
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    {question.options && question.options.length > 0 ? (
                                                        question.options.map((option: QuestionOption, optIdx: number) => (
                                                            <div
                                                                key={option.id}
                                                                className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-100 group/option"
                                                            >
                                                                <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full">
                                                                    {optIdx + 1}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    value={option.label}
                                                                    onChange={(e) => handleUpdateOption(question.id, option.id, 'label', e.target.value)}
                                                                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none"
                                                                    placeholder="Option label..."
                                                                />
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs text-gray-500 font-medium">Score:</span>
                                                                    <input
                                                                        type="number"
                                                                        value={option.value}
                                                                        onChange={(e) => handleUpdateOption(question.id, option.id, 'value', parseFloat(e.target.value) || 0)}
                                                                        className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center font-medium focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none"
                                                                        placeholder="0"
                                                                        step="0.5"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteOption(question.id, option.id)}
                                                                    className="p-1.5 hover:bg-red-100 rounded-lg opacity-0 group-hover/option:opacity-100 transition-all"
                                                                >
                                                                    <Trash2 size={14} className="text-red-500" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-4 text-gray-500 text-sm">
                                                            No options yet. Add options to define rating choices.
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => handleAddOption(question.id)}
                                                    className="w-full mt-3 px-3 py-2 border-2 border-dashed border-indigo-200 rounded-lg text-indigo-600 hover:border-indigo-400 hover:bg-white transition-all flex items-center justify-center gap-2 text-sm font-medium"
                                                >
                                                    <Plus size={16} />
                                                    Add Option
                                                </button>

                                                {/* Rating Preview */}
                                                {question.options && question.options.length > 0 && (
                                                    <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100">
                                                        <p className="text-xs text-gray-500 mb-2 font-medium">Rating Range Preview:</p>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {[...question.options]
                                                                .sort((a, b) => a.value - b.value)
                                                                .map((opt, idx) => (
                                                                    <div
                                                                        key={opt.id}
                                                                        className="px-2 py-1 rounded-full text-xs font-medium"
                                                                        style={{
                                                                            backgroundColor: `hsl(${(idx / (question.options!.length - 1 || 1)) * 120}, 70%, 90%)`,
                                                                            color: `hsl(${(idx / (question.options!.length - 1 || 1)) * 120}, 70%, 30%)`
                                                                        }}
                                                                    >
                                                                        {opt.label}: {opt.value}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        className="p-2 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                                    >
                                        <Trash2 size={16} className="text-red-600" />
                                    </button>
                                </div>
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
