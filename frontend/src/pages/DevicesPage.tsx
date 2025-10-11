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
import { SingleSelectChip, type Option } from '../components/filter/SingleSelectChip.tsx';
import { Pagination } from '../components/filter/Pagination.tsx';

export const DevicesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const typeParam = searchParams.get('type') || '';
    const ownerParam = searchParams.get('owner_id') || '';
    const sortParam = searchParams.get('sort') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;
    const pageSizeParam = parseInt(searchParams.get('pageSize') || '10', 10) || 10;

    const [sortByParam, sortDirParam] = useMemo(() => {
        if (!sortParam.includes(':')) return ['', ''];
        const [sb, sd] = sortParam.split(':');
        return [sb, sd];
    }, [sortParam]);

    const effectiveFilters = useMemo(() => {
        return {
            type: typeParam ? [typeParam] : undefined,
            owner_id: ownerParam ? [ownerParam === 'null' ? 'null' : Number(ownerParam)] : undefined,
            page: pageParam,
            pageSize: pageSizeParam,
            sortBy: (sortByParam || undefined) as any,
            sortDir: (sortDirParam || undefined) as any,
        };
    }, [typeParam, ownerParam, pageParam, pageSizeParam, sortByParam, sortDirParam]);

    const { list: deviceList, create, remove, update } = useDevices(effectiveFilters);
    const { list: employeeList } = useEmployees();
    const [openCreate, setOpenCreate] = useState(false);
    const [selected, setSelected] = useState<Device | null>(null);

    const owners = (employeeList.data as any)?.items || employeeList.data || [];
    const ownersLoading = employeeList.isLoading;

    const setParam = (key: 'type' | 'owner_id' | 'page' | 'pageSize' | 'sort', value: string) => {
        const next = new URLSearchParams(searchParams);
        if (key !== 'page') next.set('page', '1');
        if (!value) next.delete(key);
        else next.set(key, value);
        setSearchParams(next, { replace: true });
    };

    const clearAll = () => {
        const next = new URLSearchParams(searchParams);
        next.delete('type');
        next.delete('owner_id');
        next.delete('sort');
        next.set('page', '1');
        next.set('pageSize', '10');
        setSearchParams(next, { replace: true });
    };

    const typeOptions: Option[] = DEVICE_KINDS.map(t => ({ value: t, label: t }));
    const ownerOptions: Option[] = [
        { value: '', label: 'Any owner' },
        { value: 'null', label: 'Unassigned' },
        ...owners.map((o: any) => ({ value: String(o.id), label: o.name })),
    ];
    const sortOptions: Option[] = [
        { value: 'name:asc', label: 'Name A→Z' },
        { value: 'name:desc', label: 'Name Z→A' },
        { value: 'created_at:asc', label: 'Created oldest→newest' },
        { value: 'created_at:desc', label: 'Created newest→oldest' },
        { value: 'updated_at:asc', label: 'Updated oldest→newest' },
        { value: 'updated_at:desc', label: 'Updated newest→oldest' },
    ];

    const page = deviceList.data?.page || 1;
    const pageSize = deviceList.data?.pageSize || pageSizeParam;
    const total = deviceList.data?.total || 0;
    const totalPages = deviceList.data?.totalPages || 1;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Devices</h2>
            </div>

            <div className="filter-row mt" style={{ gap: 8 }}>
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
                <SingleSelectChip
                    label="Sort"
                    placeholder="Select sort…"
                    options={sortOptions}
                    value={sortParam}
                    onChange={(val) => setParam('sort', val)}
                />

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <Button variant="outline" onClick={clearAll}>Clear filters</Button>
                    <Button onClick={() => setOpenCreate(true)}>Add device</Button>
                </div>
            </div>

            <Card className="mt">
                <div>
                    {deviceList.isLoading ? (
                        'Loading...'
                    ) : (
                        <>
                            <DevicesTable
                                data={deviceList.data?.items || []}
                                owners={owners}
                                onDelete={(id) => remove.mutate(id)}
                                onRowClick={(device) => setSelected(device)}
                            />
                            <Pagination
                                page={page}
                                pageSize={pageSize}
                                total={total}
                                totalPages={totalPages}
                                onPageChange={(p) => setParam('page', String(p))}
                                pageSizeOptions={[10, 20, 50]}
                                onPageSizeChange={(n) => setParam('pageSize', String(n))}
                            />
                        </>
                    )}
                </div>
            </Card>

            <Modal open={openCreate} title="Add device" onClose={() => setOpenCreate(false)}>
                {ownersLoading ? (
                    'Loading owners…'
                ) : (
                    <DeviceForm
                        owners={owners}
                        loading={create.isPending}
                        onSubmit={(v) => create.mutate(v, { onSuccess: () => setOpenCreate(false) })}
                    />
                )}
            </Modal>

            <Modal open={!!selected} title="Edit device" onClose={() => setSelected(null)}>
                {selected && (
                    <DeviceEditForm
                        initial={selected}
                        owners={owners}
                        loading={update.isPending}
                        onSubmit={(v) => update.mutate({ id: selected.id!, data: v }, { onSuccess: () => setSelected(null) })}
                    />
                )}
            </Modal>
        </div>
    );
};