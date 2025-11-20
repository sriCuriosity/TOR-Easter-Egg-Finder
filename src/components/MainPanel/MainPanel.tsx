import RelayGraph from '../Visualizations/RelayGraph';
import Timeline from '../Visualizations/Timeline';

export default function MainPanel() {
    return (
        <div className="flex-1 flex flex-col bg-slate-900 relative overflow-hidden">
            {/* Graph Area */}
            <div className="flex-1 relative">
                <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur p-2 rounded border border-slate-700 z-10 pointer-events-none">
                    <h3 className="text-sm font-medium text-white">Relay Map</h3>
                    <p className="text-xs text-slate-400">Live visualization of trace paths</p>
                </div>

                <div className="w-full h-full">
                    <RelayGraph />
                </div>
            </div>

            {/* Timeline Area */}
            <div className="h-40 bg-slate-900 border-t border-slate-800 p-2">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Event Timeline</div>
                <Timeline />
            </div>
        </div>
    );
}
