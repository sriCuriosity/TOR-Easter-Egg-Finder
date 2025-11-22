import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle2, File as FileIcon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function EvidenceUploader() {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const addEvidenceFile = useAppStore(state => state.addEvidenceFile);
    const files = useAppStore(state => state.evidence.files);
    const removeEvidenceFile = useAppStore(state => state.removeEvidenceFile);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach(file => {
                addEvidenceFile(file);
            });
        }
    }, [addEvidenceFile]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            Array.from(e.target.files).forEach(file => {
                addEvidenceFile(file);
            });
        }
    };

    const getFileIcon = (fileName: string) => {
        if (fileName.endsWith('.pcap') || fileName.endsWith('.cap')) return <FileIcon className="w-5 h-5 text-blue-400" />;
        if (fileName.endsWith('.log') || fileName.endsWith('.txt')) return <FileText className="w-5 h-5 text-yellow-400" />;
        return <FileIcon className="w-5 h-5 text-slate-400" />;
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging
                        ? 'border-gov-secondary bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept=".pcap,.cap,.pcapng,.log,.txt,.eml"
                    onChange={handleFileSelect}
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Upload className={`w-8 h-8 ${isDragging ? 'text-gov-secondary' : 'text-gray-500'}`} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-800">
                            {isDragging ? 'Drop files to upload' : 'Drag & drop evidence files'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Supports PCAP, Server Logs, Email Headers
                        </p>
                    </div>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Uploaded Evidence ({files.length})</span>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {files.map((file, idx) => (
                            <div key={`${file.name}-${idx}`} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {getFileIcon(file.name)}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Status Indicator (Mock) */}
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 border border-green-200">
                                        <CheckCircle2 className="w-3 h-3 text-gov-success" />
                                        <span className="text-[10px] font-medium text-green-700">Ready</span>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeEvidenceFile(file.name); }}
                                        className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
