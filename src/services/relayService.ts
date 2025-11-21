import axios from 'axios';
import { db, type RelayRecord, cacheRelays } from '../db/dexie';
import { subHours, isBefore, parseISO } from 'date-fns';

const ONIONOO_URL = 'https://onionoo.torproject.org/details';
const CACHE_DURATION_HOURS = 1;

export interface RelayFilterCriteria {
    flags?: string[];
    country?: string[];
    bandwidthMin?: number;
    uptimeMin?: number;
}

export class RelayService {

    // Fetch relays (Cache-first strategy)
    static async getRelays(forceRefresh = false): Promise<RelayRecord[]> {
        try {
            const count = await db.relays.count();
            const lastUpdate = localStorage.getItem('last_relay_update');
            const isStale = !lastUpdate || isBefore(parseISO(lastUpdate), subHours(new Date(), CACHE_DURATION_HOURS));

            if (count > 0 && !isStale && !forceRefresh) {
                console.log('Serving relays from cache');
                return await db.relays.toArray();
            }

            console.log('Fetching relays from Onionoo...');
            const response = await axios.get(ONIONOO_URL, {
                params: {
                    type: 'relay',
                    fields: 'fingerprint,nickname,or_addresses,flags,country,observed_bandwidth,last_seen,first_seen,contact,family,as_number,as_name'
                }
            });

            const relays: RelayRecord[] = response.data.relays.map((r: any) => ({
                fingerprint: r.fingerprint,
                nickname: r.nickname,
                or_addresses: r.or_addresses,
                flags: r.flags,
                country: r.country,
                bandwidth: r.observed_bandwidth,
                last_seen: r.last_seen,
                first_seen: r.first_seen,
                contact: r.contact,
                family: r.family,
                as_number: r.as_number,
                as_name: r.as_name
            }));

            // Update Cache
            await db.relays.clear();
            await cacheRelays(relays);
            localStorage.setItem('last_relay_update', new Date().toISOString());

            return relays;

        } catch (error) {
            console.error('Error fetching relays:', error);
            // Fallback to cache if fetch fails
            return await db.relays.toArray();
        }
    }

    // Filter relays in-memory (or via DB query for large datasets)
    static async filterRelays(criteria: RelayFilterCriteria): Promise<RelayRecord[]> {
        let collection = db.relays.toCollection();

        // Basic filtering
        if (criteria.country && criteria.country.length > 0) {
            collection = collection.filter(r => criteria.country!.includes(r.country));
        }

        if (criteria.bandwidthMin) {
            collection = collection.filter(r => r.bandwidth >= criteria.bandwidthMin!);
        }

        // Flag filtering (requires array intersection check)
        if (criteria.flags && criteria.flags.length > 0) {
            collection = collection.filter(r =>
                criteria.flags!.every(flag => r.flags.includes(flag))
            );
        }

        return await collection.toArray();
    }
}
