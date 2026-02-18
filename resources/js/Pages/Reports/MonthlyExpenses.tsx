import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Paper, Text, Table, Button, Group, Select, SimpleGrid } from '@mantine/core';
import { formatMoney } from '@/utils/format';
import { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface MonthRow {
    month: string;
    category: string;
    total: number;
}

interface Props {
    data: Record<string, MonthRow[]>;
    grandTotal: number;
    categories: Record<string, string>;
    projects: Project[];
    filters: {
        project_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function MonthlyExpenses({ data, grandTotal, categories, projects, filters }: Props) {
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
        router.get('/reports/monthly', {
            project_id: projectId || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setProjectId('');
        setDateFrom('');
        setDateTo('');
        router.get('/reports/monthly');
    };

    return (
        <AuthenticatedLayout header={t.reports.monthlyExpenseReport}>
            <Head title={t.reports.monthlyExpenseReport} />

            <Group justify="space-between" mb="lg">
                <Button component={Link} href="/reports" variant="subtle" size="xs">
                    &larr; {t.reports.backToReports}
                </Button>
                <Group>
                    <Button component="a" href={exportUrl('monthly-expenses-pdf')} variant="light" size="xs">
                        {t.common.downloadPdf}
                    </Button>
                    <Button component="a" href={exportUrl('monthly-expenses-excel')} variant="light" size="xs" color="green">
                        {t.common.downloadExcel}
                    </Button>
                </Group>
            </Group>

            <Paper shadow="xs" p="md" radius="md" withBorder mb="lg">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.reports.grandTotal}</Text>
                <Text size="xl" fw={700} c="orange">TZS {formatMoney(grandTotal, language)}</Text>
            </Paper>

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

            {Object.entries(data).map(([month, rows]) => {
                const monthTotal = rows.reduce((sum, r) => sum + Number(r.total), 0);
                return (
                    <Paper key={month} shadow="xs" p="md" radius="md" withBorder mb="md">
                        <Text fw={600} mb="sm">{month}</Text>
                        <Table.ScrollContainer minWidth={400}>
                            <Table striped highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t.expenses.category}</Table.Th>
                                        <Table.Th ta="right">{t.cashFlow.amount} (TZS)</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {rows.map((row) => (
                                        <Table.Tr key={row.category}>
                                            <Table.Td>
                                                <Text size="sm">{categories[row.category] ?? row.category}</Text>
                                            </Table.Td>
                                            <Table.Td ta="right">
                                                <Text size="sm">{formatMoney(Number(row.total), language)}</Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                    <Table.Tr>
                                        <Table.Td>
                                            <Text size="sm" fw={700}>{t.reports.monthTotal}</Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm" fw={700}>TZS {formatMoney(monthTotal, language)}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Paper>
                );
            })}

            {Object.keys(data).length === 0 && (
                <Paper shadow="xs" p="xl" radius="md" withBorder>
                    <Text ta="center" c="dimmed">{t.common.noDataYet}</Text>
                </Paper>
            )}
        </AuthenticatedLayout>
    );
}
