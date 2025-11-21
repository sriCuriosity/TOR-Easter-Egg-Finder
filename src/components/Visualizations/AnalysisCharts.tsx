import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';

interface AnalysisChartsProps {
    evidenceData: { timestamp: number; value: number }[];
    relayData?: { timestamp: number; value: number }[];
}

export default function AnalysisCharts({ evidenceData, relayData }: AnalysisChartsProps) {

    // Merge data for chart
    const data = evidenceData.map((point, i) => ({
        time: point.timestamp,
        evidence: point.value,
        relay: relayData ? relayData[i]?.value : 0
    }));

    const formatTime = (tick: number) => format(new Date(tick), 'HH:mm:ss');

    return (
        <div className="h-64 w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Traffic Pattern Correlation
            </h3>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorEvidence" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRelay" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tickFormatter={formatTime}
                        stroke="#64748b"
                        tick={{ fontSize: 10 }}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(val) => `${(val / 1024).toFixed(0)}KB`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px' }}
                        labelFormatter={(label) => format(new Date(label), 'PP pp')}
                    />
                    <Legend />

                    <Area
                        type="monotone"
                        dataKey="evidence"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorEvidence)"
                        name="Evidence Traffic"
                        strokeWidth={2}
                    />

                    {relayData && (
                        <Area
                            type="monotone"
                            dataKey="relay"
                            stroke="#ef4444"
                            fillOpacity={1}
                            fill="url(#colorRelay)"
                            name="Relay Traffic (Simulated)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
