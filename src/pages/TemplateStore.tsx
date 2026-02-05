import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { useAppSelector } from "@/store/hooks";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { CreateTemplateModal } from "@/components/templates/CreateTemplateModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Template } from "@/types/audit.types";

export const TemplateStore: React.FC = () => {
    const templates = useAppSelector(state => state.templates.templates);
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-8xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Store</h1>
                        <p className="text-gray-600">
                            Manage your audit templates and create new ones
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create New Template
                    </Button>
                </div>

                {/* Templates Grid */}
                {templates.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No Templates Yet"
                        description="Get started by creating your first audit template"
                        action={{
                            label: 'Create Template',
                            onClick: () => setShowCreateModal(true),
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template: Template) => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Template Modal */}
            <CreateTemplateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};
