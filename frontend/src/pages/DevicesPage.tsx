import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DevicesTable } from '../components/device/DevicesTable.tsx';
import { DeviceForm } from '../components/device/DeviceForm.tsx';
import { useDevices, useEmployees } from '../useData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import type { Device } from '../types';
import { DEVICE_KINDS } from '../types';
import { DeviceEditForm } from '../components/device/DeviceEditForm.tsx';
import { SingleSelectChip, type Option } from '../components/SingleSelectChip';

export const DevicesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const typeParam = searchParams.get('type') || '';
    const ownerParam = searchParams.get('owner_id') || '';

    const effectiveFilters = useMemo(() => {
        return {
            type: typeParam ? [typeParam] : undefined,
            owner_id: ownerParam ? [ownerParam === 'null' ? 'null' : Number(ownerParam)] : undefined,
        };
    }, [typeParam, ownerParam]);

    const { list: deviceList, create, remove, update } = useDevices(effectiveFilters);
    const { list: employeeList } = useEmployees();
    const [openCreate, setOpenCreate] = useState(false);
    const [selected, setSelected] = useState<Device | null>(null);

    const owners = employeeList.data || [];
    const ownersLoading = employeeList.isLoading;

    const setParam = (key: 'type' | 'owner_id', value: string) => {
        const next = new URLSearchParams(searchParams);
        if (!value) next.delete(key);
        else next.set(key, value);
        setSearchParams(next, { replace: true });
    };

    const typeOptions: Option[] = DEVICE_KINDS.map(k => ({ value: k, label: k }));
    const ownerOptions: Option[] = [
        { value: 'null', label: 'Unassigned' },
        ...owners.map(o => ({ value: String(o.id!), label: `${o.name}${o.role ? ` (${o.role})` : ''}` }))
    ];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Devices</h2>
            </div>

            <div className="filter-row mt">
                <SingleSelectChip
                    label="Type"
                    placeholder="Select type…"
                    options={typeOptions}
                    value={typeParam}
                    onChange={(val) => setParam('type', val)}
                />

                <SingleSelectChip
                    label="Owner"
                    placeholder="Select owner…"
                    options={ownerOptions}
                    value={ownerParam}
                    onChange={(val) => setParam('owner_id', val)}
                />

                <div style={{ marginLeft: 'auto' }}>
                    <Button onClick={() => setOpenCreate(true)}>Add device</Button>
                </div>
            </div>

            <Card className="mt">
                <div>
                    {deviceList.isLoading ? (
                        'Loading...'
                    ) : (
                        <DevicesTable
                            data={deviceList.data || []}
                            owners={owners}
                            onDelete={(id) => remove.mutate(id)}
                            onRowClick={(device) => setSelected(device)}
                        />
                    )}
                </div>
            </Card>

            <Modal open={openCreate} title="Add device" onClose={() => setOpenCreate(false)}>
                {ownersLoading ? (
                    <p className="text-muted">Loading employees (owners)…</p>
                ) : (
                    <DeviceForm
                        owners={owners}
                        loading={create.isPending}
                        onSubmit={(v) => create.mutate(v, { onSuccess: () => setOpenCreate(false) })}
                    />
                )}
            </Modal>

            <Modal open={!!selected} title={selected ? `Edit device: ${selected.name}` : 'Edit device'} onClose={() => setSelected(null)}>
                {selected ? (
                    <DeviceEditForm
                        initial={selected}
                        owners={owners}
                        loading={update.isPending}
                        onCancel={() => setSelected(null)}
                        onSubmit={(data) => update.mutate({ id: selected.id!, data }, { onSuccess: () => setSelected(null) })}
                    />
                ) : null}
            </Modal>
        </div>
    );
};