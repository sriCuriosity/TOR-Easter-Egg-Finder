// Web Worker for PCAP parsing
// In a real app, this would use a library like 'pcap-parser' or 'pyshark' (via WASM)
// For this prototype, we simulate parsing logic

/* eslint-disable no-restricted-globals */
self.onmessage = async (e: MessageEvent) => {
    const { file } = e.data;

    if (!file) {
        self.postMessage({ type: 'error', error: 'No file provided' });
        return;
    }

    try {
        self.postMessage({ type: 'progress', percentage: 10 });

        // Simulate reading file
        // const text = await file.text(); // If text based
        // const buffer = await file.arrayBuffer(); // If binary

        // Mock processing delay
        const totalSteps = 10;
        for (let i = 1; i <= totalSteps; i++) {
            await new Promise(resolve => setTimeout(resolve, 200)); // Simulate work
            self.postMessage({ type: 'progress', percentage: 10 + (i / totalSteps) * 80 });
        }

        // Mock extracted sessions
        const sessions = generateMockSessions(50);

        self.postMessage({
            type: 'complete',
            sessions,
            stats: {
                packetCount: 15420,
                bytesTotal: 1024 * 1024 * 15, // 15MB
                duration: 300 // seconds
            }
        });

    } catch (error: any) {
        self.postMessage({ type: 'error', error: error.message });
    }
};

function generateMockSessions(count: number) {
    const sessions = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
        sessions.push({
            id: `sess-${Math.random().toString(36).substr(2, 9)}`,
            srcIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
            dstIp: `104.21.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            srcPort: 10000 + Math.floor(Math.random() * 50000),
            dstPort: Math.random() > 0.8 ? 80 : 443,
            protocol: 'TCP',
            startTime: now - Math.random() * 10000000,
            endTime: now,
            bytesTotal: Math.floor(Math.random() * 5000000),
            packetCount: Math.floor(Math.random() * 5000)
        });
    }
    return sessions;
}
