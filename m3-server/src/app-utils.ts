import fetch from 'cross-fetch';
import open from 'open';

export async function isServerRunning(serverUrl: string): Promise<boolean> {
    try {
        const res = await fetch(`${serverUrl}/ping`);
        return res.status === 200;
    } catch (error) {
        if (error.name === 'FetchError') {
            return false;
        } else {
            throw error;
        }
    }
}

export async function openBrowser(serverUrl: string, docName?: string): Promise<void> {
    if (docName) {
        await open(`${serverUrl}/${encodeURIComponent(docName)}`);
    } else {
        await open(`${serverUrl}`);
    }

}
