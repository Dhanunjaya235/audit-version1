import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, Image, File, AlertCircle } from 'lucide-react';

interface EvidenceUploadProps {
    questionId: string;
    onUpload: (file: File) => Promise<void>;
    existingFiles?: { id: string; fileName: string; fileUrl: string }[];
    onRemove?: (fileId: string) => void;
    disabled?: boolean;
}

const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return Image;
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return FileText;
    return File;
};

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
    onUpload,
    existingFiles = [],
    onRemove,
    disabled = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await uploadFile(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await uploadFile(files[0]);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setError(null);
        try {
            await onUpload(file);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="space-y-3">
            {/* Existing files */}
            {existingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {existingFiles.map((file) => {
                        const Icon = getFileIcon(file.fileName);
                        return (
                            <div
                                key={file.id}
                                className="
                                    flex items-center gap-2 px-3 py-2
                                    bg-slate-50 border border-slate-200 rounded-lg
                                    text-sm text-slate-700
                                    group
                                "
                            >
                                <Icon size={16} className="text-slate-400" />
                                <a
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary hover:underline truncate max-w-[150px]"
                                >
                                    {file.fileName}
                                </a>
                                {onRemove && !disabled && (
                                    <button
                                        onClick={() => onRemove(file.id)}
                                        className="
                                            opacity-0 group-hover:opacity-100
                                            p-1 hover:bg-red-100 rounded
                                            text-slate-400 hover:text-red-500
                                            transition-all duration-150
                                        "
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Upload area */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={`
                    relative flex items-center justify-center gap-3
                    px-4 py-4 rounded-lg
                    border-2 border-dashed
                    transition-all duration-200
                    ${disabled
                        ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60'
                        : isDragging
                            ? 'bg-primary/5 border-primary cursor-pointer'
                            : 'bg-slate-50 border-slate-300 hover:border-primary/50 hover:bg-slate-100 cursor-pointer'
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    disabled={disabled}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
                />

                {isUploading ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Uploading...
                    </div>
                ) : (
                    <>
                        <Upload size={18} className={isDragging ? 'text-primary' : 'text-slate-400'} />
                        <span className="text-sm text-slate-500">
                            {isDragging ? 'Drop file here' : 'Click or drag to upload evidence'}
                        </span>
                    </>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
        </div>
    );
};
