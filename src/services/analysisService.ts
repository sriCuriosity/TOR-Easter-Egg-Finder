import { type RelayRecord } from '../db/dexie';

// --- Types ---

export interface TimeSeriesPoint {
    timestamp: number;
    value: number; // bytes or packets
}

export interface CorrelationResult {
    relayFingerprint: string;
    score: number;
    confidence: number;
    details: {
        dtwDistance: number;
        timeOverlap: number;
        patternMatch: number;
    };
}

// --- Algorithms ---

// 1. SAX (Symbolic Aggregate approXimation) - Simplified
// Converts a time series into a string of characters for fast approximate matching
/*
function calculateSAX(series: TimeSeriesPoint[], windowSize: number, alphabetSize: number = 5): string {
    if (series.length === 0) return '';

    // Normalize
    const values = series.map(p => p.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length) || 1;
    const normalized = values.map(v => (v - mean) / stdDev);

    // PAA (Piecewise Aggregate Approximation)
    const segmentSize = Math.ceil(normalized.length / windowSize);
    const paa: number[] = [];
    for (let i = 0; i < normalized.length; i += segmentSize) {
        const slice = normalized.slice(i, i + segmentSize);
        paa.push(slice.reduce((a, b) => a + b, 0) / slice.length);
    }

    // Map to Symbols (a, b, c, d, e...) based on Gaussian distribution breakpoints
    // Simple breakpoints for alphabet size 5: -0.84, -0.25, 0.25, 0.84
    const breakpoints = [-0.84, -0.25, 0.25, 0.84];
    const symbols = 'abcde';

    return paa.map(val => {
        if (val < breakpoints[0]) return symbols[0];
        if (val < breakpoints[1]) return symbols[1];
        if (val < breakpoints[2]) return symbols[2];
        if (val < breakpoints[3]) return symbols[3];
        return symbols[4];
    }).join('');
}
*/

// 2. DTW (Dynamic Time Warping)
// Measures similarity between two temporal sequences that may vary in speed
function calculateDTW(seriesA: number[], seriesB: number[]): number {
    const n = seriesA.length;
    const m = seriesB.length;

    // Initialize matrix
    const dtw = Array(n + 1).fill(null).map(() => Array(m + 1).fill(Infinity));
    dtw[0][0] = 0;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const cost = Math.abs(seriesA[i - 1] - seriesB[j - 1]);
            dtw[i][j] = cost + Math.min(
                dtw[i - 1][j],     // insertion
                dtw[i][j - 1],     // deletion
                dtw[i - 1][j - 1]  // match
            );
        }
    }

    return dtw[n][m];
}

// 3. Bayesian Scoring
// Combines multiple probabilities into a final posterior probability
/*
function calculateBayesianScore(priors: number[], likelihoods: number[]): number {
    // Simplified Naive Bayes for this context
    // P(Relay | Evidence) ∝ P(Evidence | Relay) * P(Relay)

    let score = 1.0;
    for (const l of likelihoods) {
        score *= l;
    }

    // Normalize to 0-1 range roughly
    return Math.min(1.0, score);
}
*/

// --- Service ---

export class AnalysisService {

    static async correlateTraffic(
        evidenceSeries: TimeSeriesPoint[],
        relays: RelayRecord[],
        _timeWindow: { start: Date, end: Date }
    ): Promise<CorrelationResult[]> {

        console.log(`Analyzing ${relays.length} relays against evidence...`);
        const results: CorrelationResult[] = [];

        // Pre-calculate evidence signature
        const evidenceValues = evidenceSeries.map(p => p.value);
        // const evidenceSAX = calculateSAX(evidenceSeries, 10);

        // Mock Relay Traffic Generation (Since we don't have real Netflow data for all relays)
        // In a real scenario, this would query a Netflow database or look up historical bandwidth stats

        for (const relay of relays) {
            // 1. Time Overlap Check (Pruning)
            // For this mock, we assume all filtered relays are "active" in the window
            // Real impl would check 'last_seen' vs window

            // 2. Generate Mock Traffic Pattern for Relay (Simulating Netflow)
            // We'll make some relays match better than others based on random chance + bandwidth match
            const isMatch = Math.random() > 0.95; // 5% chance of being a "suspect"
            const variance = isMatch ? 0.1 : 0.8;

            const relaySeries = evidenceValues.map(v =>
                Math.max(0, v * (1 + (Math.random() * variance - variance / 2)))
            );

            // 3. Calculate DTW Distance
            // Normalize both first
            const maxEv = Math.max(...evidenceValues) || 1;
            const maxRel = Math.max(...relaySeries) || 1;
            const normEv = evidenceValues.map(v => v / maxEv);
            const normRel = relaySeries.map(v => v / maxRel);

            const distance = calculateDTW(normEv, normRel);

            // 4. Score
            // Lower distance = Higher score
            // Distance 0 => Score 1
            const similarity = 1 / (1 + distance);

            if (similarity > 0.1) {
                results.push({
                    relayFingerprint: relay.fingerprint,
                    score: similarity * 100, // 0-100 scale
                    confidence: similarity,
                    details: {
                        dtwDistance: distance,
                        timeOverlap: 1.0,
                        patternMatch: similarity
                    }
                });
            }
        }

        // Sort by score descending
        return results.sort((a, b) => b.score - a.score).slice(0, 50); // Top 50
    }
}
