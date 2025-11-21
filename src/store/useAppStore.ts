import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// --- Types ---

export interface CaseMetadata {
  id: string;
  name: string;
  description?: string;
  investigatorId?: string;
  createdAt: Date;
  authorized: boolean; // "Warrant Guard"
}

export interface EvidenceStore {
  files: File[];
  parsedSessions: any[]; // TODO: Define Session type strictly
  parsedLogs: any[];
  totalBytes: number;
  status: 'idle' | 'processing' | 'ready' | 'error';
}

export interface FilterState {
  // Primary
  exitIp?: string;
  timeWindow: {
    start?: Date;
    end?: Date;
    preset?: 'last1h' | 'last6h' | 'last24h' | 'last7d' | 'last30d' | 'custom';
  };
  servicePorts: number[];
  countries: string[];
  
  // Advanced - Relay Attributes
  relayFlags: string[]; // 'Guard', 'Exit', 'Fast', etc.
  bandwidthRange: { min: number; max: number }; // KB/s
  uptimeMinHours: number;
  
  // Advanced - Timing & Behavior
  latencyTolerance: number; // seconds
  sessionDuration: { min: number; max: number }; // seconds
  flowPattern: 'burst' | 'steady' | 'periodic' | 'custom' | null;
  
  // Computation
  confidenceThreshold: number; // 0.0 - 1.0
  computationMode: 'conservative' | 'balanced' | 'aggressive';
}

export interface InvestigationResults {
  candidates: any[]; // TODO: Define PathResult type strictly
  stats: {
    totalRelays: number;
    filteredRelays: number;
    processingTimeMs: number;
  };
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  error?: string;
}

export interface UIState {
  isSidebarOpen: boolean;
  activePanel: 'dashboard' | 'analysis' | 'settings';
  theme: 'dark' | 'light';
}

interface AppState {
  case: CaseMetadata;
  evidence: EvidenceStore;
  filters: FilterState;
  results: InvestigationResults;
  ui: UIState;

  // Actions
  setCaseMetadata: (meta: Partial<CaseMetadata>) => void;
  addEvidenceFile: (file: File) => void;
  removeEvidenceFile: (fileName: string) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  setResults: (results: Partial<InvestigationResults>) => void;
  resetFilters: () => void;
  toggleSidebar: () => void;
}

// --- Initial State ---

const initialFilters: FilterState = {
  timeWindow: { preset: 'last24h' },
  servicePorts: [],
  countries: [],
  relayFlags: [],
  bandwidthRange: { min: 0, max: 100000 },
  uptimeMinHours: 0,
  latencyTolerance: 300, // 5 min
  sessionDuration: { min: 0, max: 86400 },
  flowPattern: null,
  confidenceThreshold: 0.25,
  computationMode: 'balanced'
};

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    case: {
      id: '',
      name: 'New Investigation',
      createdAt: new Date(),
      authorized: false
    },
    evidence: {
      files: [],
      parsedSessions: [],
      parsedLogs: [],
      totalBytes: 0,
      status: 'idle'
    },
    filters: initialFilters,
    results: {
      candidates: [],
      stats: { totalRelays: 0, filteredRelays: 0, processingTimeMs: 0 },
      status: 'idle'
    },
    ui: {
      isSidebarOpen: true,
      activePanel: 'dashboard',
      theme: 'dark'
    },

    setCaseMetadata: (meta) => set((state) => ({ case: { ...state.case, ...meta } })),
    
    addEvidenceFile: (file) => set((state) => ({
      evidence: {
        ...state.evidence,
        files: [...state.evidence.files, file]
      }
    })),

    removeEvidenceFile: (fileName) => set((state) => ({
      evidence: {
        ...state.evidence,
        files: state.evidence.files.filter(f => f.name !== fileName)
      }
    })),

    updateFilters: (newFilters) => set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

    setResults: (newResults) => set((state) => ({
      results: { ...state.results, ...newResults }
    })),

    resetFilters: () => set({ filters: initialFilters }),

    toggleSidebar: () => set((state) => ({
      ui: { ...state.ui, isSidebarOpen: !state.ui.isSidebarOpen }
    }))
  }))
);
