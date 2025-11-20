import Sidebar from '../components/Sidebar/Sidebar';
import MainPanel from '../components/MainPanel/MainPanel';
import BottomDrawer from '../components/Drawer/BottomDrawer';

export default function MainLayout() {
    return (
        <div className="flex h-screen w-full bg-slate-900 text-slate-200 overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <MainPanel />
                <BottomDrawer />
            </main>
        </div>
    );
}
