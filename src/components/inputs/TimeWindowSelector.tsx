import { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { subHours, subDays } from 'date-fns';
import { useAppStore } from '../../store/useAppStore';

const PRESETS = [
    { id: 'last1h', label: 'Last 1 Hour', getValue: () => ({ start: subHours(new Date(), 1), end: new Date() }) },
    { id: 'last6h', label: 'Last 6 Hours', getValue: () => ({ start: subHours(new Date(), 6), end: new Date() }) },
    { id: 'last24h', label: 'Last 24 Hours', getValue: () => ({ start: subDays(new Date(), 1), end: new Date() }) },
    { id: 'last7d', label: 'Last 7 Days', getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
    { id: 'custom', label: 'Custom Range', getValue: () => ({ start: undefined, end: undefined }) },
];

export default function TimeWindowSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { timeWindow } = useAppStore(state => state.filters);
    const updateFilters = useAppStore(state => state.updateFilters);

    const activePreset = PRESETS.find(p => p.id === timeWindow.preset) || PRESETS[2];

    const handlePresetSelect = (presetId: string) => {
        const preset = PRESETS.find(p => p.id === presetId);
        if (preset) {
            const { start, end } = preset.getValue();
            updateFilters({
                timeWindow: {
                    preset: presetId as any,
                    start,
                    end
                }
            });
        }
        setIsOpen(false);
    };

    return (
        <div className="space-y-1.5 relative">
            <label className="text-xs font-medium text-gray-700 ml-1">Time Window</label>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 hover:border-gray-400 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gov-secondary" />
                    <span>{activePreset.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-1">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetSelect(preset.id)}
                                className={`
                  w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                  ${timeWindow.preset === preset.id
                                        ? 'bg-blue-50 text-gov-secondary'
                                        : 'text-gray-700 hover:bg-gray-100'}
                `}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    {/* Custom Range Inputs (Mock) */}
                    {timeWindow.preset === 'custom' && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-2">
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-600 uppercase">Start Time</label>
                                <input type="datetime-local" className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-900" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-600 uppercase">End Time</label>
                                <input type="datetime-local" className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-900" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
