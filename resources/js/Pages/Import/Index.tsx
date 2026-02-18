import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Paper, Text, Button, Group, FileInput, Stack, Alert, List } from '@mantine/core';

export default function ImportIndex() {
    const { data, setData, post, processing, errors, progress } = useForm<{ file: File | null }>({
        file: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) return;

        const formData = new FormData();
        formData.append('file', data.file);

        post('/import', {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Import Data">
            <Head title="Import Data" />

            <Paper shadow="xs" p="lg" radius="md" withBorder maw={600}>
                <Stack>
                    <Text size="sm">
                        Upload the ARUSHA SITE.xlsx file to import historical data.
                        The system will map data from all sheets into the appropriate tables.
                    </Text>

                    <Alert color="yellow" variant="light">
                        <Text size="sm" fw={500}>What gets imported:</Text>
                        <List size="sm" mt="xs">
                            <List.Item>ACCOUNTS + WORKS sheets → Expenses</List.Item>
                            <List.Item>baraka Doli + Baraka NJIRO → Subcontractors, Contracts, Payments</List.Item>
                            <List.Item>CASH IN - CASH OUT → Cash Inflows</List.Item>
                        </List>
                    </Alert>

                    <form onSubmit={submit}>
                        <FileInput
                            label="Excel File"
                            placeholder="Choose .xlsx file"
                            accept=".xlsx,.xls"
                            value={data.file}
                            onChange={(file) => setData('file', file)}
                            error={errors.file}
                            mb="md"
                        />

                        <Button type="submit" loading={processing} disabled={!data.file}>
                            Import Data
                        </Button>
                    </form>
                </Stack>
            </Paper>
        </AuthenticatedLayout>
    );
}
