import React, { useState } from 'react';
import { DevicesTable } from '../components/device/DevicesTable.tsx';
import { DeviceForm } from '../components/device/DeviceForm.tsx';
import { useDevices, useEmployees } from '../useData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import type { Device } from '../types';
import { DeviceEditForm } from '../components/device/DeviceEditForm.tsx';

export const DevicesPage = () => {
    const { list: deviceList, create, remove, update } = useDevices();
    const { list: employeeList } = useEmployees();
    const [openCreate, setOpenCreate] = useState(false);
    const [selected, setSelected] = useState<Device | null>(null);

    const owners = employeeList.data || [];
    const ownersLoading = employeeList.isLoading;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Devices</h2>
                <Button onClick={() => setOpenCreate(true)}>Add device</Button>
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