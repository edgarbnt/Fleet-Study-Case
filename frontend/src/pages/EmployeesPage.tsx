import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmployeesTable } from '../components/employee/EmployeesTable.tsx';
import { EmployeeForm } from '../components/employee/EmployeeForm.tsx';
import { useEmployees } from '../useData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import type { Employee } from '../types';
import { EMPLOYEE_ROLES } from '../types';
import { EmployeeEditForm } from '../components/employee/EmployeeEditForm.tsx';
import { SingleSelectChip, type Option } from '../components/filter/SingleSelectChip.tsx';
import { Pagination } from '../components/filter/Pagination.tsx';

export const EmployeesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const roleParam = searchParams.get('role') || '';
    const sortParam = searchParams.get('sort') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;
    const pageSizeParam = parseInt(searchParams.get('pageSize') || '10', 10) || 10;

    const [sortByParam, sortDirParam] = useMemo(() => {
        if (!sortParam.includes(':')) return ['', ''];
        const [sb, sd] = sortParam.split(':');
        return [sb, sd];
    }, [sortParam]);

    const employeesFilters = useMemo(() => ({
        role: roleParam || undefined,
        page: pageParam,
        pageSize: pageSizeParam,
        sortBy: (sortByParam || undefined) as any,
        sortDir: (sortDirParam || undefined) as any,
    }), [roleParam, pageParam, pageSizeParam, sortByParam, sortDirParam]);

    const { list, create, remove, update } = useEmployees(employeesFilters);
    const [openCreate, setOpenCreate] = useState(false);
    const [selected, setSelected] = useState<Employee | null>(null);

    const setParam = (key: 'role' | 'page' | 'pageSize' | 'sort', value: string) => {
        const next = new URLSearchParams(searchParams);
        if (key !== 'page') next.set('page', '1');
        if (!value) next.delete(key);
        else next.set(key, value);
        setSearchParams(next, { replace: true });
    };

    const clearAll = () => {
        const next = new URLSearchParams(searchParams);
        next.delete('role');
        next.delete('sort');
        next.set('page', '1');
        setSearchParams(next, { replace: true });
    };

    const roleOptions: Option[] = EMPLOYEE_ROLES.map(r => ({ value: r, label: r }));
    const sortOptions: Option[] = [
        { value: 'name:asc', label: 'Name A→Z' },
        { value: 'name:desc', label: 'Name Z→A' },
        { value: 'created_at:asc', label: 'Created oldest→newest' },
        { value: 'created_at:desc', label: 'Created newest→oldest' },
        { value: 'updated_at:asc', label: 'Updated oldest→newest' },
        { value: 'updated_at:desc', label: 'Updated newest→oldest' },
    ];

    const page = list.data?.page || 1;
    const pageSize = list.data?.pageSize || pageSizeParam;
    const total = list.data?.total || 0;
    const totalPages = list.data?.totalPages || 1;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Employees</h2>
            </div>

            <div className="filter-row mt">
                <SingleSelectChip
                    label="Role"
                    placeholder="Select role…"
                    options={roleOptions}
                    value={roleParam}
                    onChange={(val) => setParam('role', val)}
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
                    <Button onClick={() => setOpenCreate(true)}>Add employee</Button>
                </div>
            </div>

            <Card className="mt">
                <div>
                    {list.isLoading
                        ? 'Loading...'
                        : <>
                            <EmployeesTable
                                data={list.data?.items || []}
                                onDelete={id => remove.mutate(id)}
                                onRowClick={(emp) => setSelected(emp)}
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
                        </>}
                </div>
            </Card>

            <Modal open={openCreate} title="Add employee" onClose={() => setOpenCreate(false)}>
                <EmployeeForm
                    loading={create.isPending}
                    onSubmit={(v) => create.mutate(v, { onSuccess: () => setOpenCreate(false) })}
                />
            </Modal>

            <Modal open={!!selected} title="Edit employee" onClose={() => setSelected(null)}>
                {selected && (
                    <EmployeeEditForm
                        initial={selected}
                        loading={update.isPending}
                        onSubmit={(v) => update.mutate({ id: selected.id!, data: v }, { onSuccess: () => setSelected(null) })}
                    />
                )}
            </Modal>
        </div>
    );
};