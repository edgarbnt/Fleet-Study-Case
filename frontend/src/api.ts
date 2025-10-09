type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function http<T>(url: string, method: HttpMethod = 'GET', body?: any): Promise<T> {
    const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        let msg = '';
        try { msg = await res.text(); } catch {}
        throw new Error(msg || `HTTP ${res.status}`);
    }
    try { return await res.json(); } catch { return undefined as T; }
}

const base = '/api';

export const api = {
    getEmployees: () => http(`${base}/employees`),
    createEmployee: (data: { name: string; role: string }) => http(`${base}/employees`, 'POST', data),
    updateEmployee: (id: number, data: Partial<{ name: string; role: string }>) =>
        http(`${base}/employees/${id}`, 'PUT', data),
    deleteEmployee: async (id: number) => {
        const res = await fetch(`${base}/employees/${id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
        return true;
    },

    getDevices: () => http(`${base}/devices`),
    createDevice: (data: { name: string; type: string; owner_id: number | null }) =>
        http(`${base}/devices`, 'POST', data),
    updateDevice: (id: number, data: Partial<{ name: string; type: string; owner_id: number | null }>) =>
        http(`${base}/devices/${id}`, 'PUT', data),
    deleteDevice: async (id: number) => {
        const res = await fetch(`${base}/devices/${id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
        return true;
    },
};