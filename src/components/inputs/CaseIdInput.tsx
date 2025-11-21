import { useState, useEffect } from 'react';
import { FileDigit, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
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
                <label className="text-xs font-medium text-slate-400 ml-1">Case Reference ID</label>
                <div className="relative group">
                    <div className={`
            absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors
            ${isFocused ? 'text-accent-blue' : 'text-slate-500'}
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
              w-full bg-slate-900/50 border rounded-lg py-2 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all font-mono
              ${error
                                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                                : caseMeta.id && !error
                                    ? 'border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/20'
                                    : 'border-slate-700 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20'
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
                    <p className="text-[10px] text-red-400 ml-1">{error}</p>
                )}
            </div>

            {/* Warrant Guard / Authorization */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                <input
                    type="checkbox"
                    id="auth-check"
                    checked={caseMeta.authorized}
                    onChange={(e) => setCaseMetadata({ authorized: e.target.checked })}
                    className="mt-0.5 rounded border-slate-600 bg-slate-800 text-accent-blue focus:ring-offset-slate-900"
                />
                <label htmlFor="auth-check" className="text-xs text-slate-400 cursor-pointer select-none">
                    I confirm this investigation is authorized under active warrant or exigent circumstances.
                </label>
            </div>
        </div>
    );
}
