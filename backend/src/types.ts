export type Employee = {
    id: number;
    name: string;
    role: string;
};

export type Device = {
    id: number;
    name: string;
    type: string;
    ownerId: number | null;
    ownerName?: string | null;
};

export const ROLES = ["Developer", "Designer", "Product Manager", "Operations", "Other"] as const;
export const DEVICE_TYPES = ["Laptop", "Peripheral", "Display", "Phone", "Tablet"] as const;