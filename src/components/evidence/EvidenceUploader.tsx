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
                        ? 'border-accent-blue bg-accent-blue/10'
                        : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'}
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
                    <div className={`p-3 rounded-full ${isDragging ? 'bg-accent-blue/20' : 'bg-slate-800'}`}>
                        <Upload className={`w-8 h-8 ${isDragging ? 'text-accent-blue' : 'text-slate-400'}`} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-slate-200">
                            {isDragging ? 'Drop files to upload' : 'Drag & drop evidence files'}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            Supports PCAP, Server Logs, Email Headers
                        </p>
                    </div>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Uploaded Evidence ({files.length})</span>
                    </div>
                    <div className="divide-y divide-slate-700">
                        {files.map((file, idx) => (
                            <div key={`${file.name}-${idx}`} className="p-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {getFileIcon(file.name)}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Status Indicator (Mock) */}
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        <span className="text-[10px] font-medium text-green-400">Ready</span>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeEvidenceFile(file.name); }}
                                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
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
