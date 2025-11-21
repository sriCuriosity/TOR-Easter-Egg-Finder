export interface Session {
    id: string;
    timestamp: string; // ISO string
    source_ip: string;
    destination_ip: string;
    protocol: string;
    size: number;
}
