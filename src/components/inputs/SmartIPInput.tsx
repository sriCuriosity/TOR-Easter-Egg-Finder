import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { z } from 'zod';

const ipSchema = z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/);
const domainSchema = z.string().regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/);

interface SmartIPInputProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'ip' | 'domain' | 'both';
}

export default function SmartIPInput({ label, value = '', onChange, placeholder, type = 'both' }: SmartIPInputProps) {
    const [input, setInput] = useState(value);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        validate(input);
    }, [input]);

    const validate = (val: string) => {
        if (!val) {
            setError(null);
            setIsValid(false);
            return;
        }

        let valid = false;
        if (type === 'ip' || type === 'both') {
            if (ipSchema.safeParse(val).success) valid = true;
        }
        if (!valid && (type === 'domain' || type === 'both')) {
            if (domainSchema.safeParse(val).success) valid = true;
        }

        setIsValid(valid);
        setError(valid ? null : 'Invalid format');
        if (valid) onChange(val);
    };

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 ml-1">{label}</label>
            <div className="relative group">
                <div className={`
          absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors
          ${isFocused ? 'text-accent-blue' : 'text-slate-500'}
        `}>
                    <Globe className="w-4 h-4" />
                </div>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            w-full bg-slate-900/50 border rounded-lg py-2 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all
            ${error
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                            : isValid
                                ? 'border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/20'
                                : 'border-slate-700 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20'
                        }
          `}
                    placeholder={placeholder || "192.168.1.1 or example.com"}
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {isValid && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {error && input && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
            </div>
            {error && input && (
                <p className="text-[10px] text-red-400 ml-1">{error}</p>
            )}
        </div>
    );
}
