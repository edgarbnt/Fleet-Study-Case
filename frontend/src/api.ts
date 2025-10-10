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

function buildQuery(params?: Record<string, unknown>): string {
    if (!params) return '';
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '') continue;
        if (Array.isArray(v)) {
            if (v.length === 0) continue;
            for (const item of v) {
                if (item === undefined || item === null || item === '') continue;
                sp.append(k, String(item));
            }
        } else {
            sp.set(k, String(v));
        }
    }
    const qs = sp.toString();
    return qs ? `?${qs}` : '';
}

export type Paginated<T> = {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

export const api = {
    getEmployees: (params?: { role?: string; page?: number; pageSize?: number }) =>
        http<Paginated<any>>(`${base}/employees${buildQuery(params)}`),
    createEmployee: (data: { name: string; role: string }) => http(`${base}/employees`, 'POST', data),
    updateEmployee: (id: number, data: Partial<{ name: string; role: string }>) =>
        http(`${base}/employees/${id}`, 'PUT', data),
    deleteEmployee: async (id: number) => {
        const res = await fetch(`${base}/employees/${id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
        return true;
    },

    getDevices: (params?: {
        type?: string[];
        owner_id?: Array<number|'null'>;
        page?: number;
        pageSize?: number;
    }) => http<Paginated<any>>(`${base}/devices${buildQuery(params)}`),
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