import axios from 'axios';
import type { Relay } from '../types/Relay';

interface FetchFilters {
    country?: string;
    timestamp?: Date;
}

export async function fetchRelays(filters?: FetchFilters): Promise<Relay[]> {
    try {
        // In a real app, we might query a specific endpoint or use a proxy to avoid CORS if needed.
        // Onionoo supports CORS.
        const response = await axios.get('https://onionoo.torproject.org/details?type=relay');

        let relays: Relay[] = response.data.relays.map((r: any) => ({
            fingerprint: r.fingerprint,
            or_addresses: r.or_addresses,
            nickname: r.nickname,
            flags: r.flags,
            last_seen: r.last_seen,
            country: r.country,
            running: r.running,
            consensus_weight: r.consensus_weight
        }));

        // Client-side filtering
        relays = relays.filter(r => r.running);

        if (filters?.country) {
            relays = relays.filter(r => r.country === filters.country!.toLowerCase());
        }

        return relays;
    } catch (error) {
        console.error("Failed to fetch relays:", error);
        return [];
    }
}
