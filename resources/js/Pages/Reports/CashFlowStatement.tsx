import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Paper, SimpleGrid, Text, Table, Button, Group, Select } from '@mantine/core';
import { formatMoney, formatDate } from '@/utils/format';
import { CashInflow, Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Props {
    inflows: CashInflow[];
    totalIn: number;
    totalOut: number;
    balance: number;
    projects: Project[];
    filters: {
        project_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function CashFlowStatement({ inflows, totalIn, totalOut, balance, projects, filters }: Props) {
    const { t, language } = useLanguage();
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const projectOptions = projects.map(p => ({ value: String(p.id), label: p.name }));

    const exportUrl = (type: string) => {
        const params = new URLSearchParams();
        if (filters.project_id) params.set('project_id', filters.project_id);
        if (filters.date_from) params.set('date_from', filters.date_from);
        if (filters.date_to) params.set('date_to', filters.date_to);
        const qs = params.toString();
        return `/reports/export/${type}${qs ? `?${qs}` : ''}`;
    };

    const applyFilters = () => {
        router.get('/reports/cashflow', {
            project_id: projectId || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setProjectId('');
        setDateFrom('');
        setDateTo('');
        router.get('/reports/cashflow');
    };

    return (
        <AuthenticatedLayout header={t.reports.cashFlowStatement}>
            <Head title={t.reports.cashFlowStatement} />

            <Group justify="space-between" mb="lg">
                <Button component={Link} href="/reports" variant="subtle" size="xs">
                    &larr; {t.reports.backToReports}
                </Button>
                <Group>
                    <Button component="a" href={exportUrl('cashflow-pdf')} variant="light" size="xs">
                        {t.common.downloadPdf}
                    </Button>
                    <Button component="a" href={exportUrl('cashflow-excel')} variant="light" size="xs" color="green">
                        {t.common.downloadExcel}
                    </Button>
                </Group>
            </Group>

            {/* Summary Cards */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.cashFlow.totalReceived}</Text>
                    <Text size="xl" fw={700} c="green">TZS {formatMoney(totalIn, language)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.cashFlow.totalSpent}</Text>
                    <Text size="xl" fw={700} c="orange">TZS {formatMoney(totalOut, language)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.cashFlow.balance}</Text>
                    <Text size="xl" fw={700} c={balance >= 0 ? 'green' : 'red'}>TZS {formatMoney(balance, language)}</Text>
                </Paper>
            </SimpleGrid>

            {/* Filters */}
            <Paper shadow="xs" p="md" radius="md" withBorder mb="lg">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="sm">
                    <Select
                        placeholder={t.expenses.allProjects}
                        data={projectOptions}
                        value={projectId}
                        onChange={(v) => setProjectId(v || '')}
                        clearable
                        searchable
                    />
                    <DatePicker
                        placeholder={t.expenses.from}
                        value={dateFrom}
                        onChange={(v) => setDateFrom(v)}
                    />
                    <DatePicker
                        placeholder={t.expenses.to}
                        value={dateTo}
                        onChange={(v) => setDateTo(v)}
                    />
                    <Group>
                        <Button size="xs" onClick={applyFilters}>{t.common.filter}</Button>
                        <Button size="xs" variant="subtle" onClick={clearFilters}>{t.common.clear}</Button>
                    </Group>
                </SimpleGrid>
            </Paper>

            {/* Inflows Table */}
            <Paper shadow="xs" p="md" radius="md" withBorder>
                <Text fw={600} mb="md">{t.cashFlow.cashInflows}</Text>
                <Table.ScrollContainer minWidth={500}>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t.common.date}</Table.Th>
                                <Table.Th>{t.cashFlow.source}</Table.Th>
                                <Table.Th ta="right">{t.cashFlow.amount} (TZS)</Table.Th>
                                <Table.Th>{t.common.notes}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {inflows.map((inflow) => (
                                <Table.Tr key={inflow.id}>
                                    <Table.Td><Text size="sm">{formatDate(inflow.date, language)}</Text></Table.Td>
                                    <Table.Td><Text size="sm" fw={500}>{inflow.source}</Text></Table.Td>
                                    <Table.Td ta="right"><Text size="sm" fw={600} c="green">{formatMoney(inflow.amount, language)}</Text></Table.Td>
                                    <Table.Td><Text size="sm" c="dimmed">{inflow.notes || '-'}</Text></Table.Td>
                                </Table.Tr>
                            ))}
                            {inflows.length === 0 && (
                                <Table.Tr>
                                    <Table.Td colSpan={4}>
                                        <Text ta="center" c="dimmed" py="md">{t.common.noDataYet}</Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>
        </AuthenticatedLayout>
    );
}
