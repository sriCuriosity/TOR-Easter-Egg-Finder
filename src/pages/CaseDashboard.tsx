import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Clock, Search, FileText } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const MOCK_CASES = [
    { id: 'CASE-2024-001', name: 'Operation DarkFlow', status: 'Active', created: '2024-03-10', investigator: 'Det. Singh' },
    { id: 'CASE-2024-002', name: 'Ransomware Trace', status: 'Closed', created: '2024-02-15', investigator: 'Det. Singh' },
    { id: 'CASE-2024-003', name: 'Unknown Exit Node', status: 'Pending', created: '2024-03-12', investigator: 'Analyst Rao' },
];

export default function CaseDashboard() {
    const navigate = useNavigate();

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Case Dashboard</h1>
                            <p className="text-gray-600">Manage active investigations and traces</p>
                        </div>
                        <button
                            onClick={() => navigate('/analysis/new')}
                            className="bg-gov-secondary hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Investigation
                        </button>
                    </header>

                    {/* Stats / Quick Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-600 font-medium">Active Cases</h3>
                                <FolderOpen className="w-5 h-5 text-gov-secondary" />
                            </div>
                            <p className="text-3xl font-bold">12</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-600 font-medium">Recent Traces</h3>
                                <Clock className="w-5 h-5 text-gov-success" />
                            </div>
                            <p className="text-3xl font-bold">48</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-600 font-medium">Reports Generated</h3>
                                <FileText className="w-5 h-5 text-gov-danger" />
                            </div>
                            <p className="text-3xl font-bold">156</p>
                        </div>
                    </div>

                    {/* Case List */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="font-semibold">Recent Cases</h2>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search cases..."
                                    className="bg-white border border-gray-300 rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-gov-secondary"
                                />
                            </div>
                        </div>

                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-3">Case ID</th>
                                    <th className="px-6 py-3">Case Name</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Created</th>
                                    <th className="px-6 py-3">Investigator</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {MOCK_CASES.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-gov-secondary">{c.id}</td>
                                        <td className="px-6 py-4 font-medium">{c.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${c.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                    c.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                                        'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">{c.created}</td>
                                        <td className="px-6 py-4 text-gray-700 text-sm">{c.investigator}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => navigate(`/analysis/${c.id}`)}
                                                className="text-gov-secondary hover:text-blue-700 text-sm font-medium"
                                            >
                                                Open
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
