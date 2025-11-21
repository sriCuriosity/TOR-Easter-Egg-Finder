export interface PathResult {
    entry: string; // Nickname or IP
    middle: string;
    exit: string;
    score: number; // 0-1 confidence
    latency?: number;
    flags: string[];
}
