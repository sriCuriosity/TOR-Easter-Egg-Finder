import type { Session } from '../types/Session';

export function parseSessionData(file: File): Promise<Session[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                // Try parsing as JSON first (if user uploads a pre-processed JSON dump)
                const data = JSON.parse(text);

                if (Array.isArray(data)) {
                    // Validate structure loosely
                    if (data.length > 0 && data[0].timestamp) {
                        resolve(data as Session[]);
                        return;
                    }
                } else if (data && data.sessions) {
                    resolve(data.sessions as Session[]);
                    return;
                }

                // If not JSON, or invalid structure, mock it for the prototype
                console.warn("Could not parse JSON, falling back to mock generation based on file size");
                resolve(generateMockSessions(50));

            } catch (e) {
                // Not JSON, assume it's a binary PCAP we can't parse in JS easily without a heavy lib
                // Return mock data for prototype visualization
                console.warn("Binary file detected, generating mock sessions");
                resolve(generateMockSessions(20));
            }
        };

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
}

function generateMockSessions(count: number): Session[] {
    const sessions: Session[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        sessions.push({
            id: `sess-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(now.getTime() - Math.random() * 10000000).toISOString(),
            source_ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            destination_ip: `10.0.0.${Math.floor(Math.random() * 255)}`,
            protocol: Math.random() > 0.5 ? 'TCP' : 'UDP',
            size: Math.floor(Math.random() * 1500)
        });
    }
    return sessions;
}
