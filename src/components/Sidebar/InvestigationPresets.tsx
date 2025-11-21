import { Zap, ShieldAlert, Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const PRESETS = [
    {
        id: 'dark_market',
        label: 'Dark Market',
        icon: <Globe className="w-4 h-4 text-purple-400" />,
        description: 'Finds relays with high uptime and stable bandwidth often used by markets.',
        filters: {
            relayFlags: ['Stable', 'Fast', 'Guard'],
            uptimeMinHours: 168, // 1 week
            computationMode: 'balanced'
        }
    },
    {
        id: 'ransomware',
        label: 'Ransomware C2',
        icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
        description: 'Detects short-lived, high-latency circuits typical of C2 beacons.',
        filters: {
            relayFlags: ['Fast'],
            flowPattern: 'periodic',
            latencyTolerance: 500,
            computationMode: 'aggressive'
        }
    },
    {
        id: 'data_exfil',
        label: 'Data Exfiltration',
        icon: <Zap className="w-4 h-4 text-yellow-400" />,
        description: 'Focuses on high-bandwidth exit nodes capable of large transfers.',
        filters: {
            relayFlags: ['Exit', 'Fast'],
            bandwidthRange: { min: 5000, max: 1000000 },
            computationMode: 'conservative'
        }
    }
];

export default function InvestigationPresets() {
    const updateFilters = useAppStore(state => state.updateFilters);

    return (
        <div className="grid grid-cols-3 gap-2 mb-4">
            {PRESETS.map(preset => (
                <button
                    key={preset.id}
                    onClick={() => updateFilters(preset.filters as any)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-accent-blue/50 transition-all group text-center"
                    title={preset.description}
                >
                    <div className="p-2 rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors">
                        {preset.icon}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">
                        {preset.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
