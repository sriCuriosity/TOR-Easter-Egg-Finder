import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock login
        setTimeout(() => {
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 shadow">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <Shield className="w-8 h-8 text-gov-secondary" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">TOR Mapping Platform</h1>
                        <p className="text-gray-600 mt-2">Authorized Access Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Officer ID / Badge Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 bg-white border border-gray-300 rounded-md py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gov-secondary focus:border-transparent"
                                    placeholder="OFF-2024-X99"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full pl-10 bg-white border border-gray-300 rounded-md py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gov-secondary focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gov-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-600">
                        <p>Restricted System. All activities are monitored and logged.</p>
                        <p>Unauthorized access is a criminal offense.</p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
