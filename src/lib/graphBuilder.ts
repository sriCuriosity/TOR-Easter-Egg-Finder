import type { PathResult } from '../types/PathResult';

export function generateGraph(paths: PathResult[]) {
    const nodes = new Map<string, any>();
    const links: any[] = [];

    paths.forEach(p => {
        // Add Nodes
        if (!nodes.has(p.entry)) {
            nodes.set(p.entry, { id: p.entry, group: 'entry', ip: 'x.x.x.x', country: '??', flag: 'Guard' });
        }
        if (!nodes.has(p.middle)) {
            nodes.set(p.middle, { id: p.middle, group: 'middle', ip: 'x.x.x.x', country: '??', flag: 'Middle' });
        }
        if (!nodes.has(p.exit)) {
            nodes.set(p.exit, { id: p.exit, group: 'exit', ip: 'x.x.x.x', country: '??', flag: 'Exit' });
        }

        // Add Links
        links.push({ source: p.entry, target: p.middle, value: p.score });
        links.push({ source: p.middle, target: p.exit, value: p.score });
    });

    return {
        nodes: Array.from(nodes.values()),
        links
    };
}
