import React from 'react';
import { DevicesTable } from '../components/DevicesTable';
import { DeviceForm } from '../components/DeviceForm';
import { useDevices, useEmployees } from '../useData';
import { Card } from '../components/Card';

export const DevicesPage = () => {
    const { list: deviceList, create, remove } = useDevices();
    const { list: employeeList } = useEmployees();

    const owners = employeeList.data || [];
    const ownersLoading = employeeList.isLoading;

    return (
        <div className="fade-in">
            <h2>Devices</h2>
            <Card className="mt">
                {ownersLoading ? (
                    <p className="text-muted">Loading employees (owners)…</p>
                ) : (
                    <DeviceForm
                        owners={owners}
                        loading={create.isPending}
                        onSubmit={(v) => create.mutate(v)}
                    />
                )}

                <div style={{ marginTop: '1rem' }}>
                    {deviceList.isLoading ? (
                        'Loading...'
                    ) : (
                        <DevicesTable
                            data={deviceList.data || []}
                            owners={owners}
                            onDelete={(id) => remove.mutate(id)}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};