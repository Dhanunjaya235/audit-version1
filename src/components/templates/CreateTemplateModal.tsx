import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FileText, Copy } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initDraftTemplate, createDraftFromExisting } from '@/store/slices/templatesSlice';
import { useNavigate } from 'react-router-dom';
import { generateId } from '@/utils/calculations';

interface CreateTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const templates = useAppSelector(state => state.templates.templates);
    const loading = useAppSelector(state => state.templates.loading);
    const [step, setStep] = useState<'choose' | 'name' | 'select'>('choose');
    const [templateName, setTemplateName] = useState('');
    const [selectedBaseId, setSelectedBaseId] = useState<string>('');

    const handleClose = () => {
        setStep('choose');
        setTemplateName('');
        setSelectedBaseId('');
        onClose();
    };

    const handleFromScratch = () => {
        setStep('name');
    };

    const handleFromExisting = () => {
        setStep('select');
    };

    const handleTemplateSelect = (templateId: string) => {
        setSelectedBaseId(templateId);
        setTemplateName('');
        setStep('name');
    };

    const handleCreate = () => {
        if (!templateName.trim()) return;

        // Generate ID here to ensure we know where to navigate
        const newTemplateId = generateId();

        if (step === 'name') {
            // Synchronous dispatch for scratch
            dispatch(initDraftTemplate({
                name: templateName.trim(),
                id: newTemplateId
            }));
            handleClose();
            navigate(`/templates/${newTemplateId}`);
        } else if (step === 'select' && selectedBaseId) {
            // Async dispatch for existing (fetch + clone)
            dispatch(createDraftFromExisting({
                name: templateName.trim(),
                baseTemplateId: selectedBaseId,
                newId: newTemplateId
            })).unwrap().then(() => {
                handleClose();
                navigate(`/templates/${newTemplateId}`);
            }).catch((err) => {
                console.error("Failed to create draft from existing:", err);
                // Optionally show error in UI
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New Template">
            {step === 'choose' && (
                <div className="space-y-4">
                    <p className="text-gray-600 mb-6">How would you like to create your template?</p>

                    <button
                        onClick={handleFromScratch}
                        className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="text-primary" size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900 mb-1">From Scratch</h3>
                                <p className="text-sm text-gray-600">Start with a blank template</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleFromExisting}
                        className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Copy className="text-primary" size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900 mb-1">Choose From Existing</h3>
                                <p className="text-sm text-gray-600">Copy an existing template</p>
                            </div>
                        </div>
                    </button>
                </div>
            )}

            {step === 'select' && (
                <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Select a template to copy:</p>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {templates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedBaseId === template.id
                                    ? 'border-primary bg-primary bg-opacity-5'
                                    : 'border-gray-200 hover:border-primary'
                                    }`}
                            >
                                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {template.auditAreas.length} audit areas
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'name' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Template Name
                        </label>
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Enter template name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreate}
                            disabled={!templateName.trim() || loading}
                        >
                            {(loading && selectedBaseId) ? 'Cloning...' : 'Create Template'}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
