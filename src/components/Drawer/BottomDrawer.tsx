import { useState } from 'react';
import { ChevronUp, ChevronDown, Download, Maximize2, Minimize2 } from 'lucide-react';
import ResultsTable from '../Visualizations/ResultsTable';
import { useAppStore } from '../../store/useAppStore';

export default function BottomDrawer() {
    const [isOpen, setIsOpen] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    const { results } = useAppStore(state => state);

    const toggleDrawer = () => {
        if (isMaximized) {
            setIsMaximized(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const toggleMaximize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMaximized(!isMaximized);
        setIsOpen(true);
    };

    return (
        <div
            className={`
        fixed bottom-0 left-80 right-0 bg-slate-900 border-t border-slate-700 shadow-2xl transition-all duration-300 ease-in-out z-20
        ${isMaximized ? 'h-[calc(100vh-4rem)]' : isOpen ? 'h-80' : 'h-12'}
      `}
        >
            {/* Header / Handle */}
            <div
                onClick={toggleDrawer}
                className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 cursor-pointer hover:bg-slate-750 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
                        <h3 className="font-semibold text-slate-200">Analysis Results</h3>
                    </div>

                    {results.stats && (
                        <div className="flex items-center gap-3 text-xs text-slate-500 border-l border-slate-700 pl-4">
                            <span>{results.candidates.length} Candidates</span>
                            <span>•</span>
                            <span>{results.stats.totalRelays} Relays Scanned</span>
                            <span>•</span>
                            <span>{results.stats.processingTimeMs}ms</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                        title="Export Results"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={toggleMaximize}
                        className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    >
                        {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Content */}
            {isOpen && (
                <div className="h-[calc(100%-3rem)] bg-slate-900 overflow-hidden">
                    <ResultsTable />
                </div>
            )}
        </div>
    );
}
