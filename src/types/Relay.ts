export interface Relay {
    fingerprint: string;
    or_addresses: string[];
    nickname: string;
    flags: string[];
    last_seen: string;
    country?: string;
    running: boolean;
    consensus_weight: number;
}
