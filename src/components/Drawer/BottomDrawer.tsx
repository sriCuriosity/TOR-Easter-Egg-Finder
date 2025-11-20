import { useState } from 'react';
import { ChevronUp, ChevronDown, Download, FileText, Image, Filter } from 'lucide-react';

const MOCK_RESULTS = [
    { id: 1, entry: '104.21.5.1', middle: '88.12.9.2', exit: '192.168.1.1', score: 92, latency: 120, flags: ['Guard', 'Fast'] },
    { id: 2, entry: '45.33.1.5', middle: '12.5.1.9', exit: '192.168.1.1', score: 65, latency: 210, flags: ['Exit'] },
    { id: 3, entry: '185.100.8.2', middle: '77.2.1.4', exit: '192.168.1.1', score: 88, latency: 145, flags: ['Guard'] },
    { id: 4, entry: '23.11.5.1', middle: '99.1.2.3', exit: '192.168.1.1', score: 45, latency: 300, flags: ['Stable'] },
    { id: 5, entry: '199.2.1.1', middle: '55.4.3.2', exit: '192.168.1.1', score: 78, latency: 180, flags: ['Fast'] },
];

export default function BottomDrawer() {
    const [isOpen, setIsOpen] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filter, setFilter] = useState('');

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...MOCK_RESULTS].filter(item =>
        item.entry.includes(filter) || item.middle.includes(filter) || item.exit.includes(filter)
    ).sort((a: any, b: any) => {
        if (!sortConfig) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className={`bg-slate-800 border-t border-slate-700 flex flex-col transition-all duration-300 ${isOpen ? 'h-64' : 'h-10'}`}>
            <div
                className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 cursor-pointer hover:bg-slate-750"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                    <span className="font-medium text-white">Analysis Results & Confidence Scores</span>
                    <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">{MOCK_RESULTS.length} Candidates</span>
                </div>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Export PDF">
                        <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Download JSON">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Save Graph Image">
                        <Image className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-2 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
                        <div className="relative">
                            <Filter className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Filter IPs..."
                                className="bg-slate-900 border border-slate-700 rounded pl-7 pr-2 py-1 text-xs text-white focus:outline-none focus:border-accent-blue"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase bg-slate-900 text-slate-400 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 cursor-pointer hover:text-white" onClick={() => handleSort('entry')}>Entry Node</th>
                                    <th className="px-4 py-2 cursor-pointer hover:text-white" onClick={() => handleSort('middle')}>Middle Node</th>
                                    <th className="px-4 py-2 cursor-pointer hover:text-white" onClick={() => handleSort('exit')}>Exit Node</th>
                                    <th className="px-4 py-2 cursor-pointer hover:text-white" onClick={() => handleSort('score')}>Score</th>
                                    <th className="px-4 py-2 cursor-pointer hover:text-white" onClick={() => handleSort('latency')}>Latency</th>
                                    <th className="px-4 py-2">Flags</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {sortedData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-2 font-mono text-slate-300">{row.entry}</td>
                                        <td className="px-4 py-2 font-mono text-slate-300">{row.middle}</td>
                                        <td className="px-4 py-2 font-mono text-slate-300">{row.exit}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${row.score > 80 ? 'bg-accent-green' :
                                                                row.score > 50 ? 'bg-yellow-500' : 'bg-accent-red'
                                                            }`}
                                                        style={{ width: `${row.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`font-bold ${row.score > 80 ? 'text-accent-green' :
                                                        row.score > 50 ? 'text-yellow-500' : 'text-accent-red'
                                                    }`}>{row.score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">{row.latency}ms</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-1">
                                                {row.flags.map(flag => (
                                                    <span key={flag} className="bg-blue-900/50 text-blue-200 px-1.5 py-0.5 rounded text-[10px] border border-blue-800">
                                                        {flag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
