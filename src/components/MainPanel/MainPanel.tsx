import RelayGraph from '../Visualizations/RelayGraph';
import Timeline from '../Visualizations/Timeline';
import AnalysisCharts from '../Visualizations/AnalysisCharts';
import { useAppStore } from '../../store/useAppStore';
import { useRef, useMemo } from 'react';

export default function MainPanel() {
    const { results } = useAppStore(state => state);
    const nowRef = useRef<number>(Date.now());

    // Mock evidence data for chart if empty
    const evidenceData = useMemo(() => ([
        { timestamp: nowRef.current - 3600000, value: 100 },
        { timestamp: nowRef.current - 3000000, value: 500 },
        { timestamp: nowRef.current - 2400000, value: 200 },
        { timestamp: nowRef.current - 1800000, value: 800 },
        { timestamp: nowRef.current - 1200000, value: 300 },
        { timestamp: nowRef.current - 600000, value: 600 },
        { timestamp: nowRef.current, value: 400 },
    ]), []);

    return (
        <main className="flex-1 bg-gray-50 relative flex flex-col overflow-y-auto">
            {/* Graph View (Top) */}
            <div id="graph-section" className="flex-1 relative border-b border-gray-200 bg-white">
                <RelayGraph data={results.graph || { nodes: [], links: [] }} />

                {/* Overlay Stats */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-gray-200 p-3 rounded-lg shadow">
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Active Nodes</div>
                    <div className="text-2xl font-mono font-bold text-gov-secondary">{results.candidates.length}</div>
                </div>
            </div>

            {/* Analysis Charts (Middle) */}
            <div id="charts-section" className="h-72 p-4 bg-white border-t border-gray-200">
                <AnalysisCharts evidenceData={evidenceData} />
            </div>

            {/* Timeline (Bottom) */}
            <div id="timeline-section" className="h-48 border-t border-gray-200 bg-white">
                <Timeline />
            </div>
        </main>
    );
}
