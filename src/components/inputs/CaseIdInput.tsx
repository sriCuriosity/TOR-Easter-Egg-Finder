import { useState, useEffect } from 'react';
import { FileDigit, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function CaseIdInput() {
    const { case: caseMeta, setCaseMetadata } = useAppStore(state => state);
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Format: CASE-YYYY-MMDD-NNNN
    const caseIdRegex = /^CASE-\d{4}-\d{4}-\d{4}$/;

    useEffect(() => {
        if (!caseMeta.id) {
            setError(null);
            return;
        }
        if (!caseIdRegex.test(caseMeta.id)) {
            setError('Format: CASE-YYYY-MMDD-NNNN');
        } else {
            setError(null);
        }
    }, [caseMeta.id]);

    return (
        <div className="space-y-3">
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 ml-1">Case Reference ID</label>
                <div className="relative group">
                    <div className={`
            absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors
            ${isFocused ? 'text-gov-secondary' : 'text-gray-500'}
          `}>
                        <FileDigit className="w-4 h-4" />
                    </div>

                    <input
                        type="text"
                        value={caseMeta.id}
                        onChange={(e) => setCaseMetadata({ id: e.target.value.toUpperCase() })}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`
              w-full bg-white border rounded-lg py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all font-mono
              ${error
                                ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                                : caseMeta.id && !error
                                    ? 'border-green-500 focus:border-green-600 focus:ring-1 focus:ring-green-500/20'
                                    : 'border-gray-300 focus:border-gov-secondary focus:ring-1 focus:ring-blue-200'
                            }
            `}
                        placeholder="CASE-2024-0101-0001"
                    />

                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {caseMeta.id && !error && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {error && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                </div>
                {error && (
                    <p className="text-[10px] text-red-600 ml-1">{error}</p>
                )}
            </div>

            {/* Warrant Guard / Authorization */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
                <input
                    type="checkbox"
                    id="auth-check"
                    checked={caseMeta.authorized}
                    onChange={(e) => setCaseMetadata({ authorized: e.target.checked })}
                    className="mt-0.5 rounded border-gray-300 bg-white text-gov-secondary focus:ring-offset-white"
                />
                <label htmlFor="auth-check" className="text-xs text-gray-700 cursor-pointer select-none">
                    I confirm this investigation is authorized under active warrant or exigent circumstances.
                </label>
            </div>
        </div>
    );
}
