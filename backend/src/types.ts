export interface Employee {
    id?: number;
    name: string;
    role: string;
    created_at?: string;
    updated_at?: string;
}

export interface Device {
    id?: number;
    name: string;
    type: string;
    owner_id?: number | null;
    created_at?: string;
    updated_at?: string;
}