export const EMPLOYEE_ROLES = [
    'Admin',
    'Manager',
    'Staff',
    'Technician',
    'Intern',
    'HR',
    'Finance',
    'IT',
] as const;
export type EmployeeRole = typeof EMPLOYEE_ROLES[number];

export interface Employee {
    id?: number;
    name: string;
    role: EmployeeRole;
    created_at?: string;
    updated_at?: string;
}
export type NewEmployee = Pick<Employee, 'name' | 'role'>;

export const DEVICE_KINDS = [
    'laptop',
    'phone',
    'tablet',
    'monitor',
    'accessory',
] as const;
export type DeviceKind = typeof DEVICE_KINDS[number];

export interface Device {
    id?: number;
    name: string;
    type: DeviceKind;
    owner_id?: number | null;
    created_at?: string;
    updated_at?: string;
}

export type NewDevice = {
    name: string;
    type: DeviceKind;
    owner_id: number | null;
};