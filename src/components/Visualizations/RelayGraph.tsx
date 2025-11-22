import { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export interface RelayGraphProps {
    data?: {
        nodes: any[];
        links: any[];
    };
}

const MOCK_DATA = {
    nodes: [
        { id: 'Entry-1', group: 'entry', val: 10 },
        { id: 'Entry-2', group: 'entry', val: 10 },
        { id: 'Middle-1', group: 'middle', val: 5 },
        { id: 'Middle-2', group: 'middle', val: 5 },
        { id: 'Middle-3', group: 'middle', val: 5 },
        { id: 'Exit-1', group: 'exit', val: 10 },
        { id: 'Exit-2', group: 'exit', val: 10 },
    ],
    links: [
        { source: 'Entry-1', target: 'Middle-1', value: 1 },
        { source: 'Entry-1', target: 'Middle-2', value: 3 },
        { source: 'Entry-2', target: 'Middle-3', value: 2 },
        { source: 'Middle-1', target: 'Exit-1', value: 5 },
        { source: 'Middle-2', target: 'Exit-1', value: 1 },
        { source: 'Middle-3', target: 'Exit-2', value: 4 },
    ]
};

export default function RelayGraph({ data }: RelayGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">
            <ForceGraph2D
                width={dimensions.width}
                height={dimensions.height}
                graphData={data || MOCK_DATA}
                nodeLabel="id"
                nodeColor={(node: any) =>
                    node.group === 'entry' ? '#2e5aac' :
                        node.group === 'middle' ? '#2e8540' :
                            node.group === 'exit' ? '#b50909' : '#6b7280'
                }
                linkColor={() => '#d1d5db'}
                backgroundColor="#ffffff"
                nodeRelSize={6}
                linkWidth={(link: any) => link.value || 1}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
            />
        </div>
    );
}
