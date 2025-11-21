
import Sidebar from '../components/Sidebar/Sidebar';
import MainPanel from '../components/MainPanel/MainPanel';
import { useAppStore } from '../store/useAppStore';

const MainLayout = () => {
    const { results, setResults } = useAppStore();

    const handleAnalysisStart = async () => {
        setResults({ status: 'analyzing' });

        // Simulate analysis delay
        setTimeout(() => {
            // In a real app, this would trigger the backend analysis
            // For now we just update status to complete after a delay
            // The actual results population might happen elsewhere or here
            setResults({
                status: 'complete',
                // candidates: [] // Keep existing or update
            });
        }, 2000);
    };

    return (
        <div className="flex h-screen w-full bg-slate-950 text-white overflow-hidden">
            <Sidebar
                onAnalysisStart={handleAnalysisStart}
                isAnalyzing={results.status === 'analyzing'}
            />
            <MainPanel />
        </div>
    );
};

export default MainLayout;
