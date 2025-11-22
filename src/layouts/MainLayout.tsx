
import Sidebar from '../components/Sidebar/Sidebar';
import MainPanel from '../components/MainPanel/MainPanel';
import { useAppStore } from '../store/useAppStore';
import { useEffect } from 'react';
import { generateGraph } from '../lib/graphBuilder';
import type { PathResult } from '../types/PathResult';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MainLayout = () => {
    const { results, setResults } = useAppStore();

    const handleAnalysisStart = async () => {
        setResults({ status: 'analyzing' });

        // Simulate analysis delay
        setTimeout(() => {
            const mockPaths: PathResult[] = [
                { entry: 'Entry-Alpha', middle: 'Middle-X1', exit: 'Exit-Delta', score: 0.82, flags: ['Guard','Fast'] },
                { entry: 'Entry-Beta', middle: 'Middle-X2', exit: 'Exit-Gamma', score: 0.76, flags: ['Stable'] },
                { entry: 'Entry-Alpha', middle: 'Middle-X3', exit: 'Exit-Omega', score: 0.68, flags: ['Exit'] },
                { entry: 'Entry-Charlie', middle: 'Middle-X2', exit: 'Exit-Delta', score: 0.71, flags: ['Valid'] }
            ];
            const graph = generateGraph(mockPaths);
            const candidates = mockPaths.map((p, i) => ({
                id: `${p.entry}-${p.middle}-${p.exit}-${i}`,
                ip: '0.0.0.0',
                name: p.exit,
                bandwidth: 0,
                uptime: 99.9,
                consensusWeight: 0,
                flags: p.flags,
                country: 'XX',
                probability: Math.round(p.score * 100),
                path: [p.entry, p.middle, p.exit],
                events: []
            }));
            setResults({
                status: 'complete',
                candidates,
                graph
            });
        }, 2000);
    };

    useEffect(() => {
        if (results.status === 'idle' || (results.graph && results.graph.nodes.length === 0)) {
            const mockPaths: PathResult[] = [
                { entry: 'Entry-Alpha', middle: 'Middle-X1', exit: 'Exit-Delta', score: 0.82, flags: ['Guard','Fast'] },
                { entry: 'Entry-Beta', middle: 'Middle-X2', exit: 'Exit-Gamma', score: 0.76, flags: ['Stable'] },
                { entry: 'Entry-Alpha', middle: 'Middle-X3', exit: 'Exit-Omega', score: 0.68, flags: ['Exit'] }
            ];
            const graph = generateGraph(mockPaths);
            const candidates = mockPaths.map((p, i) => ({
                id: `${p.entry}-${p.middle}-${p.exit}-${i}`,
                ip: '0.0.0.0',
                name: p.exit,
                bandwidth: 0,
                uptime: 99.9,
                consensusWeight: 0,
                flags: p.flags,
                country: 'XX',
                probability: Math.round(p.score * 100),
                path: [p.entry, p.middle, p.exit],
                events: []
            }));
            setResults({ candidates, graph, status: 'complete' });
        }
    }, []);

    const downloadReport = async () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const capture = async (id: string) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const canvas = await html2canvas(el, { scale: 2 });
            return canvas.toDataURL('image/png');
        };

        const graphImg = await capture('graph-section');
        if (graphImg) {
            doc.addImage(graphImg, 'PNG', 40, 40, 515, 350);
        }
        doc.text('TOR Mapping Report', 40, 410);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 430);

        doc.addPage();
        const chartsImg = await capture('charts-section');
        if (chartsImg) {
            doc.addImage(chartsImg, 'PNG', 40, 40, 515, 350);
        }
        doc.text('Evidence and Relay Time Series', 40, 410);

        doc.addPage();
        const timelineImg = await capture('timeline-section');
        if (timelineImg) {
            doc.addImage(timelineImg, 'PNG', 40, 40, 515, 200);
        }
        let y = 260;
        doc.text('Top Candidates', 40, y);
        y += 20;
        results.candidates.slice(0, 8).forEach((c, idx) => {
            doc.text(`#${idx + 1} ${c.name} (${c.ip}) - ${c.probability}%`, 40, y);
            y += 16;
        });

        doc.save('tor-mapping-report.pdf');
    };

    return (
        <div className="flex h-screen w-full bg-gray-50 text-gray-900">
            <div className="fixed top-0 left-0 right-0 h-14 bg-gov-primary text-white z-40 shadow">
                <div className="h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white/10" />
                        <span className="text-sm uppercase tracking-wider">TOR Mapping Platform</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={downloadReport} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded">
                            Download Report (PDF)
                        </button>
                        <span className="text-xs">Authorized Access</span>
                    </div>
                </div>
            </div>
            <div className="flex w-full pt-14 overflow-hidden">
                <Sidebar
                    onAnalysisStart={handleAnalysisStart}
                    isAnalyzing={results.status === 'analyzing'}
                />
                <MainPanel />
            </div>
        </div>
    );
};

export default MainLayout;
