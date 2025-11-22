import { useState } from 'react';
import { ChevronDown, ChevronRight, Shield, Globe, Activity, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function ResultsTable() {
    const { results } = useAppStore(state => state);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (results.candidates.length === 0) {
        return (
            <div className="p-8 text-center text-gray-600">
                <p>No analysis results yet. Start an investigation to see candidates.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-8"></th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Relay Name / IP</th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Flags</th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {results.candidates.map((candidate, idx) => (
                            <>
                                <tr
                                    key={candidate.id}
                                    onClick={() => toggleExpand(candidate.id)}
                                    className={`
                    cursor-pointer transition-colors hover:bg-gray-50
                    ${expandedId === candidate.id ? 'bg-gray-50' : ''}
                  `}
                                >
                                    <td className="p-3 text-gray-500">
                                        {expandedId === candidate.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 font-mono">#{idx + 1}</td>
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{candidate.name}</span>
                                            <span className="text-xs text-gray-600 font-mono">{candidate.ip}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${candidate.probability > 80 ? 'bg-gov-danger' :
                                                            candidate.probability > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${candidate.probability}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{candidate.probability.toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-1">
                                            {candidate.flags.slice(0, 3).map((flag: string) => (
                                                <span key={flag} className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-700 border border-gray-200">
                                                    {flag}
                                                </span>
                                            ))}
                                            {candidate.flags.length > 3 && (
                                                <span className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-700 border border-gray-200">
                                                    +{candidate.flags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1.5">
                                            <Globe className="w-3 h-3 text-gray-500" />
                                            <span className="text-sm text-gray-700">{candidate.country}</span>
                                        </div>
                                    </td>
                                </tr>

                                {/* Explainability Card */}
                                {expandedId === candidate.id && (
                                    <tr>
                                        <td colSpan={6} className="p-0 bg-white">
                                            <div className="p-4 grid grid-cols-3 gap-4 border-b border-gray-200 animate-in slide-in-from-top-2 duration-200">

                                                {/* Why it matched */}
                                                <div className="col-span-1 space-y-2">
                                                    <h4 className="text-xs font-semibold text-gov-secondary uppercase tracking-wider flex items-center gap-2">
                                                        <Activity className="w-3 h-3" />
                                                        Match Analysis
                                                    </h4>
                                                    <ul className="space-y-1 text-xs text-gray-600">
                                                        <li className="flex justify-between">
                                                            <span>Temporal Correlation:</span>
                                                            <span className="text-gov-success font-mono">High (0.92)</span>
                                                        </li>
                                                        <li className="flex justify-between">
                                                            <span>Bandwidth Capacity:</span>
                                                            <span className="text-gray-700 font-mono">Sufficient</span>
                                                        </li>
                                                        <li className="flex justify-between">
                                                            <span>Uptime Stability:</span>
                                                            <span className="text-gray-700 font-mono">99.9%</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Risk Factors */}
                                                <div className="col-span-1 space-y-2">
                                                    <h4 className="text-xs font-semibold text-yellow-600 uppercase tracking-wider flex items-center gap-2">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Risk Factors
                                                    </h4>
                                                    <ul className="space-y-1 text-xs text-gray-600">
                                                        <li className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gov-danger"></span>
                                                            Known Bad Exit Node
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                                            High Latency Variance
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Metadata */}
                                                <div className="col-span-1 space-y-2">
                                                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                                        <Shield className="w-3 h-3" />
                                                        Relay Metadata
                                                    </h4>
                                                    <div className="text-xs text-gray-600 font-mono space-y-1">
                                                        <p>FP: {candidate.id.substring(0, 16)}...</p>
                                                        <p>Ver: 0.4.7.13</p>
                                                        <p>OS: Linux</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
