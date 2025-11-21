import Dexie, { Table } from 'dexie';

export interface RelayRecord {
    fingerprint: string;
    nickname: string;
    or_addresses: string[];
    flags: string[];
    country: string;
    bandwidth: number; // KB/s
    last_seen: string; // ISO string
    first_seen: string; // ISO string
    contact?: string;
    family?: string[];
    as_number?: string;
    as_name?: string;
}

export interface CaseRecord {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    metadata: any; // JSON blob of filters/state
}

class TorTracerDB extends Dexie {
    relays!: Table<RelayRecord>;
    cases!: Table<CaseRecord>;

    constructor() {
        super('TorTracerDB');
        this.version(1).stores({
            relays: 'fingerprint, nickname, country, flags, bandwidth, last_seen', // Indexed fields
            cases: 'id, created_at'
        });
    }
}

export const db = new TorTracerDB();

// Helper to bulk put relays (for caching Onionoo data)
export async function cacheRelays(relays: RelayRecord[]) {
    try {
        await db.relays.bulkPut(relays);
        console.log(`Cached ${relays.length} relays`);
    } catch (error) {
        console.error('Failed to cache relays:', error);
    }
}

export async function getRelayCount() {
    return await db.relays.count();
}
