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
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <button
                    onClick={() => toggleSection('relay')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <Shield className="w-4 h-4 text-gov-secondary" />
                        Relay Attributes
                    </div>
                    {openSections.relay ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                </button>

                {openSections.relay && (
                    <div className="p-3 space-y-4 border-t border-gray-200">
                        {/* Flags */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">Required Flags</label>
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
                                                ? 'bg-blue-50 border-gov-secondary text-gov-secondary'
                                                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}
                    `}
                                    >
                                        {flag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bandwidth Slider (Mock) */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
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
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gov-secondary"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Timing & Behavior Section */}
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <button
                    onClick={() => toggleSection('timing')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <Activity className="w-4 h-4 text-gov-success" />
                        Timing & Behavior
                    </div>
                    {openSections.timing ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                </button>

                {openSections.timing && (
                    <div className="p-3 space-y-4 border-t border-gray-200">
                        {/* Latency Tolerance */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
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
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gov-success"
                            />
                        </div>

                        {/* Flow Pattern */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">Traffic Flow Pattern</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['burst', 'steady', 'periodic'].map(pattern => (
                                    <button
                                        key={pattern}
                                        onClick={() => updateFilters({ flowPattern: filters.flowPattern === pattern ? null : pattern as any })}
                                        className={`
                      px-2 py-1.5 text-xs rounded border transition-all text-center capitalize
                      ${filters.flowPattern === pattern
                                                ? 'bg-green-50 border-gov-success text-green-700'
                                                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}
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
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <button
                    onClick={() => toggleSection('compute')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <Cpu className="w-4 h-4 text-purple-600" />
                        Computation
                    </div>
                    {openSections.compute ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                </button>

                {openSections.compute && (
                    <div className="p-3 space-y-4 border-t border-gray-200">
                        {/* Confidence Threshold */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
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
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        {/* Mode */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">Analysis Mode</label>
                            <div className="flex rounded-lg overflow-hidden border border-gray-300">
                                {['conservative', 'balanced', 'aggressive'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => updateFilters({ computationMode: mode as any })}
                                        className={`
                      flex-1 py-1.5 text-[10px] uppercase font-bold transition-colors
                      ${filters.computationMode === mode
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-100'}
                    `}
                                    >
                                        {mode.slice(0, 4)}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-600 flex items-center gap-1">
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
