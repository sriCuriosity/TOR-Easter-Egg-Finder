import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { RelayService } from '../services/relayService';
import { AnalysisService, type TimeSeriesPoint } from '../services/analysisService';
import type { RelayRecord } from '../db/dexie';

interface ParsedSession {
  startTime: number;
  bytesTotal: number;
}

export const useRunAnalysis = () => {
  const {
    filters,
    evidence,
    setResults
  } = useAppStore(state => state);

  return useMutation({
    mutationFn: async () => {
      // 1. Prepare Evidence Data
      // In a real app, we'd wait for the Worker to finish parsing.
      // Here we assume evidence.parsedSessions is populated or we generate mock points if empty
      let evidenceSeries: TimeSeriesPoint[] = [];

      if (evidence.parsedSessions.length > 0) {
        // Convert sessions to time series (bytes per second)
        // Simplified: Just taking start times and bytes
        evidenceSeries = (evidence.parsedSessions as ParsedSession[]).map((s) => ({
          timestamp: s.startTime,
          value: s.bytesTotal
        })).sort((a: TimeSeriesPoint, b: TimeSeriesPoint) => a.timestamp - b.timestamp);
      } else {
        // Fallback for demo if no file uploaded
        const now = Date.now();
        for (let i = 0; i < 20; i++) {
          evidenceSeries.push({ timestamp: now - i * 1000, value: Math.random() * 1000 });
        }
      }

      // 2. Fetch Relays
      const relays = await RelayService.getRelays();

      // 3. Filter Relays
      const filteredRelays = await RelayService.filterRelays({
        country: filters.countries,
        flags: filters.relayFlags,
        bandwidthMin: filters.bandwidthRange.min
      });

      // 4. Run Analysis
      const matches = await AnalysisService.correlateTraffic(
        evidenceSeries,
        filteredRelays as RelayRecord[],
        { start: new Date(), end: new Date() } // TODO: Use actual window
      );

      // 5. Format Results for UI
      const candidates = matches.map(m => {
        const relay = filteredRelays.find(r => r.fingerprint === m.relayFingerprint);
        return {
          id: m.relayFingerprint,
          ip: relay?.or_addresses[0]?.split(':')[0] || 'Unknown',
          name: relay?.nickname || 'Unnamed',
          bandwidth: relay?.bandwidth || 0,
          uptime: 99.9, // Mock
          consensusWeight: 0,
          flags: relay?.flags || [],
          country: relay?.country || 'XX',
          probability: m.score,
          path: [
            { id: 'src', type: 'source', ip: 'Target', lat: 0, lon: 0 },
            { id: m.relayFingerprint, type: 'relay', ip: relay?.or_addresses[0]?.split(':')[0], lat: 0, lon: 0 },
            { id: 'dst', type: 'destination', ip: 'Destination', lat: 0, lon: 0 }
          ],
          events: []
        };
      });

      return {
        candidates,
        stats: {
          totalRelays: relays.length,
          filteredRelays: filteredRelays.length,
          processingTimeMs: 0 // Calculated by wrapper usually
        }
      };
    },
    onSuccess: (data) => {
      setResults({
        candidates: data.candidates,
        stats: { ...data.stats, processingTimeMs: 500 }, // Mock time
        status: 'complete'
      });
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      setResults({ status: 'error', error: error.message });
    }
  });
};
