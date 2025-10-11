type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function http<T>(url: string, method: HttpMethod = 'GET', body?: any): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

const base = '/api';

function buildQuery(params?: Record<string, unknown>): string {
    if (!params) return '';
    const qp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '') continue;
        if (Array.isArray(v)) {
            for (const item of v) qp.append(k, String(item));
        } else {
            qp.set(k, String(v));
        }
    }
    const s = qp.toString();
    return s ? `?${s}` : '';
}

export type Paginated<T> = {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

export const api = {
    getEmployees: (params?: {
        role?: string;
        page?: number;
        pageSize?: number;
        sortBy?: 'name' | 'created_at' | 'updated_at';
        sortDir?: 'asc' | 'desc';
    }) => http<Paginated<any>>(`${base}/employees${buildQuery(params)}`),
    createEmployee: (data: { name: string; role: string }) => http(`${base}/employees`, 'POST', data),
    updateEmployee: (id: number, data: Partial<{ name: string; role: string }>) =>
        http(`${base}/employees/${id}`, 'PUT', data),
    deleteEmployee: async (id: number) => {
        const res = await fetch(`${base}/employees/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        return true;
    },

    getDevices: (params?: {
        type?: string[];
        owner_id?: Array<number | 'null'>;
        page?: number;
        pageSize?: number;
        sortBy?: 'name' | 'created_at' | 'updated_at';
        sortDir?: 'asc' | 'desc';
    }) => http<Paginated<any>>(`${base}/devices${buildQuery(params)}`),
    createDevice: (data: { name: string; type: string; owner_id?: number | null }) => http(`${base}/devices`, 'POST', data),
    updateDevice: (id: number, data: Partial<{ name: string; type: string; owner_id: number | null }>) =>
        http(`${base}/devices/${id}`, 'PUT', data),
    deleteDevice: async (id: number) => {
        const res = await fetch(`${base}/devices/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        return true;
    },
};