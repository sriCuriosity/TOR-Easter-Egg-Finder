import { useState } from 'react';
import { Search, Play, RotateCcw, Globe, SlidersHorizontal } from 'lucide-react';
import EvidenceUploader from '../evidence/EvidenceUploader';
import SmartIPInput from '../inputs/SmartIPInput';
import TimeWindowSelector from '../inputs/TimeWindowSelector';
import CaseIdInput from '../inputs/CaseIdInput';
import AdvancedFiltersPanel from './AdvancedFiltersPanel';
import InvestigationPresets from './InvestigationPresets';
import { useAppStore } from '../../store/useAppStore';

interface SidebarProps {
    onAnalysisStart: (filters: any, file: File | null) => void;
    isAnalyzing: boolean;
}

export default function Sidebar({ onAnalysisStart, isAnalyzing }: SidebarProps) {
    const { filters, updateFilters, resetFilters } = useAppStore(state => state);

    // Local state for country (could be moved to store if needed globally immediately)
    // For now we sync it to store on change
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        updateFilters({ countries: val ? [val] : [] });
    };

    const handleStart = () => {
        // Trigger analysis via prop (legacy) or store action
        onAnalysisStart(filters, null); // Files are now in store
    };

    return (
        <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-accent-blue" />
                    Analysis Parameters
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Presets */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Quick Presets
                    </h3>
                    <InvestigationPresets />
                </div>

                <div className="h-px bg-slate-700/50" />

                {/* Case ID & Authorization */}
                <CaseIdInput />

                <div className="h-px bg-slate-700/50" />

                {/* Target Definition */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Target Criteria
                    </h3>

                    <SmartIPInput
                        label="Target Exit Node"
                        value={filters.exitIp}
                        onChange={(val) => updateFilters({ exitIp: val })}
                        placeholder="Exit IP (e.g. 185.x.x.x)"
                        type="ip"
                    />

                    <TimeWindowSelector />

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400 ml-1">Country Filter</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                <Globe className="w-4 h-4" />
                            </div>
                            <select
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-sm text-slate-200 focus:border-accent-blue focus:outline-none appearance-none"
                                value={filters.countries[0] || ''}
                                onChange={handleCountryChange}
                            >
                                <option value="">All Countries</option>
                                <option value="us">United States</option>
                                <option value="de">Germany</option>
                                <option value="ru">Russia</option>
                                <option value="cn">China</option>
                                <option value="nl">Netherlands</option>
                                <option value="fr">France</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-700/50" />

                {/* Evidence Upload */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Evidence Source
                    </h3>
                    <EvidenceUploader />
                </div>

                <div className="h-px bg-slate-700/50" />

                {/* Advanced Filters */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <SlidersHorizontal className="w-3 h-3" />
                        Advanced Filters
                    </h3>
                    <AdvancedFiltersPanel />
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-700 bg-slate-800 space-y-3">
                <button
                    onClick={handleStart}
                    disabled={isAnalyzing}
                    className={`
                        w-full bg-accent-blue hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg 
                        flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20
                        ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-900/40 hover:-translate-y-0.5'}
                    `}
                >
                    {isAnalyzing ? (
                        <span className="animate-spin">⟳</span>
                    ) : (
                        <Play className="w-4 h-4 fill-current" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                </button>
                <button
                    onClick={resetFilters}
                    className="w-full bg-transparent hover:bg-slate-700 text-slate-400 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset Filters
                </button>
            </div>
        </aside>
    );
}
