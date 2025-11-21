import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Upload, Target, Sliders } from 'lucide-react';
import EvidenceUploader from '../evidence/EvidenceUploader';
import SmartIPInput from '../inputs/SmartIPInput';
import CaseIdInput from '../inputs/CaseIdInput';
import InvestigationPresets from '../Sidebar/InvestigationPresets';
import { useAppStore } from '../../store/useAppStore';

interface GuidedWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    { id: 'evidence', title: 'Upload Evidence', icon: <Upload className="w-5 h-5" /> },
    { id: 'target', title: 'Define Target', icon: <Target className="w-5 h-5" /> },
    { id: 'filters', title: 'Refine Filters', icon: <Sliders className="w-5 h-5" /> },
];

export default function GuidedWizard({ isOpen, onClose }: GuidedWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const { filters, updateFilters } = useAppStore(state => state);

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">New Investigation</h2>
                        <p className="text-sm text-slate-400">Follow the steps to configure your analysis.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800">
                    <div className="flex items-center justify-between relative">
                        {/* Line */}
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-700 -z-10" />

                        {STEPS.map((step, idx) => (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-900 px-2">
                                <div
                                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${idx <= currentStep
                                            ? 'bg-accent-blue border-accent-blue text-white'
                                            : 'bg-slate-800 border-slate-600 text-slate-500'}
                  `}
                                >
                                    {idx < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                                </div>
                                <span className={`text-xs font-medium ${idx <= currentStep ? 'text-slate-200' : 'text-slate-500'}`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2 mb-8">
                                <h3 className="text-lg font-medium text-white">Start with Evidence</h3>
                                <p className="text-slate-400 text-sm">Upload PCAP files, server logs, or email headers to begin.</p>
                            </div>
                            <EvidenceUploader />
                            <div className="mt-8">
                                <CaseIdInput />
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2 mb-8">
                                <h3 className="text-lg font-medium text-white">Who is the Target?</h3>
                                <p className="text-slate-400 text-sm">Specify the Exit Node IP or Destination you are investigating.</p>
                            </div>
                            <div className="max-w-md mx-auto space-y-6">
                                <SmartIPInput
                                    label="Target Exit Node IP"
                                    value={filters.exitIp}
                                    onChange={(val) => updateFilters({ exitIp: val })}
                                    placeholder="e.g. 185.x.x.x"
                                    type="ip"
                                />
                                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <p className="text-xs text-slate-400 mb-2">Or select a common threat profile:</p>
                                    <InvestigationPresets />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2 mb-8">
                                <h3 className="text-lg font-medium text-white">Review & Launch</h3>
                                <p className="text-slate-400 text-sm">Confirm your settings before starting the analysis.</p>
                            </div>

                            <div className="bg-slate-800 rounded-lg p-4 space-y-3 text-sm border border-slate-700">
                                <div className="flex justify-between border-b border-slate-700 pb-2">
                                    <span className="text-slate-400">Case ID</span>
                                    <span className="text-white font-mono">CASE-2024-XXXX</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-700 pb-2">
                                    <span className="text-slate-400">Target</span>
                                    <span className="text-white font-mono">{filters.exitIp || 'Not Specified'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-700 pb-2">
                                    <span className="text-slate-400">Mode</span>
                                    <span className="text-accent-blue font-bold uppercase">{filters.computationMode}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-900/50">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`
              px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors
              ${currentStep === 0
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="px-6 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                    >
                        {currentStep === STEPS.length - 1 ? 'Start Analysis' : 'Next Step'}
                        {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
                    </button>
                </div>

            </div>
        </div>
    );
}
