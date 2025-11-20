import { Filter, Upload, Play, RotateCcw } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-accent-blue" />
                    Analysis Parameters
                </h2>
            </div>

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Inputs Placeholder */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Exit IP Address</label>
                        <input
                            type="text"
                            placeholder="e.g. 192.168.1.1"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Time Window</label>
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Country Filter</label>
                        <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue">
                            <option>All Countries</option>
                            <option>Germany</option>
                            <option>Netherlands</option>
                            <option>United States</option>
                        </select>
                    </div>
                </div>

                {/* PCAP Upload Placeholder */}
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-accent-blue transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Drag & drop PCAP or log file</p>
                </div>
            </div>

            <div className="p-4 border-t border-slate-700 space-y-3">
                <button className="w-full bg-accent-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors">
                    <Play className="w-4 h-4" />
                    Start Analysis
                </button>
                <button className="w-full bg-transparent border border-slate-600 hover:border-slate-500 text-slate-300 font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    Reset Filters
                </button>
            </div>
        </aside>
    );
}
