import { useState } from 'react';
import { ChevronDown, ChevronRight, Shield, Activity, Cpu, Info } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function AdvancedFiltersPanel() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        relay: true,
        timing: false,
        compute: false
    });

    const { filters, updateFilters } = useAppStore(state => state);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="space-y-2">
            {/* Relay Attributes Section */}
            <div className="border border-slate-700 rounded-lg bg-slate-900/30 overflow-hidden">
                <button
                    onClick={() => toggleSection('relay')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Shield className="w-4 h-4 text-accent-blue" />
                        Relay Attributes
                    </div>
                    {openSections.relay ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>

                {openSections.relay && (
                    <div className="p-3 space-y-4 border-t border-slate-700/50">
                        {/* Flags */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">Required Flags</label>
                            <div className="flex flex-wrap gap-2">
                                {['Guard', 'Exit', 'Fast', 'Stable', 'Valid'].map(flag => (
                                    <button
                                        key={flag}
                                        onClick={() => {
                                            const newFlags = filters.relayFlags.includes(flag)
                                                ? filters.relayFlags.filter(f => f !== flag)
                                                : [...filters.relayFlags, flag];
                                            updateFilters({ relayFlags: newFlags });
                                        }}
                                        className={`
                      px-2 py-1 text-[10px] uppercase font-bold rounded border transition-all
                      ${filters.relayFlags.includes(flag)
                                                ? 'bg-accent-blue/20 border-accent-blue text-accent-blue'
                                                : 'bg-slate-800 border-slate-600 text-slate-500 hover:border-slate-500'}
                    `}
                                    >
                                        {flag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bandwidth Slider (Mock) */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Min Bandwidth</span>
                                <span>{filters.bandwidthRange.min} KB/s</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={filters.bandwidthRange.min}
                                onChange={(e) => updateFilters({ bandwidthRange: { ...filters.bandwidthRange, min: parseInt(e.target.value) } })}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Timing & Behavior Section */}
            <div className="border border-slate-700 rounded-lg bg-slate-900/30 overflow-hidden">
                <button
                    onClick={() => toggleSection('timing')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Activity className="w-4 h-4 text-green-400" />
                        Timing & Behavior
                    </div>
                    {openSections.timing ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>

                {openSections.timing && (
                    <div className="p-3 space-y-4 border-t border-slate-700/50">
                        {/* Latency Tolerance */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Latency Tolerance</span>
                                <span>±{filters.latencyTolerance}s</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="600"
                                step="10"
                                value={filters.latencyTolerance}
                                onChange={(e) => updateFilters({ latencyTolerance: parseInt(e.target.value) })}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-400"
                            />
                        </div>

                        {/* Flow Pattern */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">Traffic Flow Pattern</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['burst', 'steady', 'periodic'].map(pattern => (
                                    <button
                                        key={pattern}
                                        onClick={() => updateFilters({ flowPattern: filters.flowPattern === pattern ? null : pattern as any })}
                                        className={`
                      px-2 py-1.5 text-xs rounded border transition-all text-center capitalize
                      ${filters.flowPattern === pattern
                                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                                : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'}
                    `}
                                    >
                                        {pattern}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Computation Section */}
            <div className="border border-slate-700 rounded-lg bg-slate-900/30 overflow-hidden">
                <button
                    onClick={() => toggleSection('compute')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        Computation
                    </div>
                    {openSections.compute ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>

                {openSections.compute && (
                    <div className="p-3 space-y-4 border-t border-slate-700/50">
                        {/* Confidence Threshold */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Min Confidence</span>
                                <span>{(filters.confidenceThreshold * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={filters.confidenceThreshold}
                                onChange={(e) => updateFilters({ confidenceThreshold: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                            />
                        </div>

                        {/* Mode */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">Analysis Mode</label>
                            <div className="flex rounded-lg overflow-hidden border border-slate-600">
                                {['conservative', 'balanced', 'aggressive'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => updateFilters({ computationMode: mode as any })}
                                        className={`
                      flex-1 py-1.5 text-[10px] uppercase font-bold transition-colors
                      ${filters.computationMode === mode
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                    `}
                                    >
                                        {mode.slice(0, 4)}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                {filters.computationMode === 'conservative' && 'Strict matching, fewer false positives.'}
                                {filters.computationMode === 'balanced' && 'Standard heuristic weighting.'}
                                {filters.computationMode === 'aggressive' && 'Broad search, higher recall.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
