import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';

const MOCK_EVENTS = [
    { id: 1, time: '10:00:01', node: 'entry1', type: 'packet_in', duration: 50 },
    { id: 2, time: '10:00:02', node: 'middle1', type: 'packet_fwd', duration: 40 },
    { id: 3, time: '10:00:03', node: 'exit1', type: 'packet_out', duration: 60 },
    { id: 4, time: '10:00:05', node: 'entry2', type: 'packet_in', duration: 45 },
    { id: 5, time: '10:00:06', node: 'middle2', type: 'packet_fwd', duration: 55 },
];

export default function Timeline() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1 rounded hover:bg-gray-100 text-gov-secondary transition-colors"
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="text-xs text-gray-600 font-mono">
                        {new Date().toLocaleTimeString()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">1x Speed</span>
                    <SkipForward className="w-3 h-3 text-gray-500 cursor-pointer hover:text-gray-700" />
                </div>
            </div>

            <div className="flex-1 relative bg-white rounded border border-gray-200 overflow-hidden mx-2 mb-2">
                {/* Progress Bar */}
                <div
                    className="absolute top-0 left-0 h-full w-0.5 bg-gov-danger/70 z-10 transition-all duration-100"
                    style={{ left: `${progress}%` }}
                ></div>

                {/* Tracks */}
                <div className="absolute inset-0 flex flex-col justify-center gap-2 p-2">
                    {/* Entry Track */}
                    <div className="h-6 bg-gray-100 rounded flex items-center px-2 relative">
                        <span className="text-[10px] text-gray-600 w-12">Entry</span>
                        <div className="flex-1 relative h-full">
                            {MOCK_EVENTS.filter(e => e.node.startsWith('entry')).map(e => (
                                <div key={e.id} className="absolute top-1 h-4 bg-gov-secondary/30 rounded" style={{ left: `${(e.id * 10) + 5}%`, width: '5%' }}></div>
                            ))}
                        </div>
                    </div>
                    {/* Middle Track */}
                    <div className="h-6 bg-gray-100 rounded flex items-center px-2 relative">
                        <span className="text-[10px] text-gray-600 w-12">Middle</span>
                        <div className="flex-1 relative h-full">
                            {MOCK_EVENTS.filter(e => e.node.startsWith('middle')).map(e => (
                                <div key={e.id} className="absolute top-1 h-4 bg-gov-success/30 rounded" style={{ left: `${(e.id * 10) + 15}%`, width: '5%' }}></div>
                            ))}
                        </div>
                    </div>
                    {/* Exit Track */}
                    <div className="h-6 bg-gray-100 rounded flex items-center px-2 relative">
                        <span className="text-[10px] text-gray-600 w-12">Exit</span>
                        <div className="flex-1 relative h-full">
                            {MOCK_EVENTS.filter(e => e.node.startsWith('exit')).map(e => (
                                <div key={e.id} className="absolute top-1 h-4 bg-gov-danger/30 rounded" style={{ left: `${(e.id * 10) + 25}%`, width: '5%' }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
