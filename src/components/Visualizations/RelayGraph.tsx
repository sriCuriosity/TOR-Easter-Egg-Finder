import { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';


// Mock Data
const MOCK_DATA = {
    nodes: [
        { id: 'entry1', group: 'entry', ip: '104.21.5.1', country: 'DE', flag: 'Guard' },
        { id: 'entry2', group: 'entry', ip: '45.33.1.5', country: 'US', flag: 'Guard' },
        { id: 'middle1', group: 'middle', ip: '88.12.9.2', country: 'NL', flag: 'Fast' },
        { id: 'middle2', group: 'middle', ip: '12.5.1.9', country: 'FR', flag: 'Stable' },
        { id: 'exit1', group: 'exit', ip: '192.168.1.1', country: 'IN', flag: 'Exit' },
    ],
    links: [
        { source: 'entry1', target: 'middle1', value: 0.9 },
        { source: 'entry2', target: 'middle2', value: 0.7 },
        { source: 'middle1', target: 'exit1', value: 0.92 },
        { source: 'middle2', target: 'exit1', value: 0.65 },
    ]
};

export default function RelayGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-slate-900">
            <ForceGraph2D
                width={dimensions.width}
                height={dimensions.height}
                graphData={MOCK_DATA}
                nodeLabel="ip"
                nodeColor={(node: any) => {
                    if (node.group === 'entry') return '#3b82f6'; // Blue
                    if (node.group === 'middle') return '#64ffda'; // Green (using accent)
                    if (node.group === 'exit') return '#ef4444'; // Red
                    return '#ccc';
                }}
                nodeRelSize={6}
                linkColor={() => '#ffffff33'}
                linkWidth={(link: any) => link.value * 3}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={(d: any) => d.value * 0.01}
                backgroundColor="#0f172a"
            />
        </div>
    );
}
