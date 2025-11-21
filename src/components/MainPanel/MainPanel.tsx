import RelayGraph from '../Visualizations/RelayGraph';
import Timeline from '../Visualizations/Timeline';
import AnalysisCharts from '../Visualizations/AnalysisCharts';
import { useAppStore } from '../../store/useAppStore';

export default function MainPanel() {
    const { results } = useAppStore(state => state);

    // Mock evidence data for chart if empty
    const evidenceData = [
        { timestamp: Date.now() - 3600000, value: 100 },
        { timestamp: Date.now() - 3000000, value: 500 },
        { timestamp: Date.now() - 2400000, value: 200 },
        { timestamp: Date.now() - 1800000, value: 800 },
        { timestamp: Date.now() - 1200000, value: 300 },
        { timestamp: Date.now() - 600000, value: 600 },
        { timestamp: Date.now(), value: 400 },
    ];

    return (
        <main className="flex-1 bg-slate-900 relative flex flex-col overflow-hidden">
            {/* Graph View (Top) */}
            <div className="flex-1 relative border-b border-slate-800">
                <RelayGraph data={results.candidates} />

                {/* Overlay Stats */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg shadow-xl">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active Nodes</div>
                    <div className="text-2xl font-mono font-bold text-accent-blue">{results.candidates.length}</div>
                </div>
            </div>

            {/* Analysis Charts (Middle) */}
            <div className="h-72 p-4 bg-slate-900 border-t border-slate-800">
                <AnalysisCharts evidenceData={evidenceData} />
            </div>

            {/* Timeline (Bottom) */}
            <div className="h-48 border-t border-slate-800 bg-slate-900/50">
                <Timeline />
            </div>
        </main>
    );
}
