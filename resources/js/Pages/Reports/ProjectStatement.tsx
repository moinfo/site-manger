import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Paper, SimpleGrid, Text, Table, Button, Group, Select } from '@mantine/core';
import { formatMoney, formatDate } from '@/utils/format';
import { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Transaction {
    date: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

interface Props {
    transactions: Transaction[];
    openingBalance: number;
    totalDebit: number;
    totalCredit: number;
    closingBalance: number;
    projectName: string | null;
    projects: Project[];
    filters: {
        project_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function ProjectStatement({
    transactions, openingBalance, totalDebit, totalCredit, closingBalance,
    projectName, projects, filters,
}: Props) {
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
        router.get('/reports/project-statement', {
            project_id: projectId || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setProjectId('');
        setDateFrom('');
        setDateTo('');
        router.get('/reports/project-statement');
    };

    const title = projectName
        ? `${t.reports.projectStatement}: ${projectName}`
        : t.reports.projectStatement;

    return (
        <AuthenticatedLayout header={title}>
            <Head title={t.reports.projectStatement} />

            <Group justify="space-between" mb="lg">
                <Button component={Link} href="/reports" variant="subtle" size="xs">
                    &larr; {t.reports.backToReports}
                </Button>
                <Group>
                    <Button component="a" href={exportUrl('project-statement-pdf')} variant="light" size="xs">
                        {t.common.downloadPdf}
                    </Button>
                    <Button component="a" href={exportUrl('project-statement-excel')} variant="light" size="xs" color="green">
                        {t.common.downloadExcel}
                    </Button>
                </Group>
            </Group>

            {/* Summary Cards */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="lg">
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.reports.openingBalance}</Text>
                    <Text size="xl" fw={700} c={openingBalance >= 0 ? 'blue' : 'red'}>
                        TZS {formatMoney(openingBalance, language)}
                    </Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.reports.totalDebit}</Text>
                    <Text size="xl" fw={700} c="green">TZS {formatMoney(totalDebit, language)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.reports.totalCredit}</Text>
                    <Text size="xl" fw={700} c="yellow">TZS {formatMoney(totalCredit, language)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.reports.closingBalance}</Text>
                    <Text size="xl" fw={700} c={closingBalance >= 0 ? 'green' : 'red'}>
                        TZS {formatMoney(closingBalance, language)}
                    </Text>
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

            {/* Statement Table */}
            <Paper shadow="xs" p="md" radius="md" withBorder>
                <Table.ScrollContainer minWidth={600}>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t.common.date}</Table.Th>
                                <Table.Th>{t.reports.description}</Table.Th>
                                <Table.Th ta="right">{t.reports.debit} (TZS)</Table.Th>
                                <Table.Th ta="right">{t.reports.credit} (TZS)</Table.Th>
                                <Table.Th ta="right">{t.reports.balance} (TZS)</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {/* Opening balance row */}
                            <Table.Tr bg="var(--mantine-color-default-hover)">
                                <Table.Td />
                                <Table.Td><Text size="sm" fw={700}>{t.reports.openingBalance}</Text></Table.Td>
                                <Table.Td />
                                <Table.Td />
                                <Table.Td ta="right">
                                    <Text size="sm" fw={700} c={openingBalance >= 0 ? 'blue' : 'red'}>
                                        {formatMoney(openingBalance, language)}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>

                            {transactions.map((tx, i) => (
                                <Table.Tr key={i}>
                                    <Table.Td><Text size="sm">{formatDate(tx.date, language)}</Text></Table.Td>
                                    <Table.Td><Text size="sm">{tx.description}</Text></Table.Td>
                                    <Table.Td ta="right">
                                        {tx.debit > 0 && <Text size="sm" c="green">{formatMoney(tx.debit, language)}</Text>}
                                    </Table.Td>
                                    <Table.Td ta="right">
                                        {tx.credit > 0 && <Text size="sm" c="yellow">{formatMoney(tx.credit, language)}</Text>}
                                    </Table.Td>
                                    <Table.Td ta="right">
                                        <Text size="sm" fw={500} c={tx.balance >= 0 ? undefined : 'red'}>
                                            {formatMoney(tx.balance, language)}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ))}

                            {transactions.length === 0 && (
                                <Table.Tr>
                                    <Table.Td colSpan={5}>
                                        <Text ta="center" c="dimmed" py="md">
                                            {filters.project_id ? t.common.noDataYet : t.reports.selectProject}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}

                            {/* Closing balance row */}
                            <Table.Tr bg="var(--mantine-color-default-hover)">
                                <Table.Td />
                                <Table.Td><Text size="sm" fw={700}>{t.reports.closingBalance}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={700} c="green">{formatMoney(totalDebit, language)}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={700} c="yellow">{formatMoney(totalCredit, language)}</Text></Table.Td>
                                <Table.Td ta="right">
                                    <Text size="sm" fw={700} c={closingBalance >= 0 ? 'green' : 'red'}>
                                        {formatMoney(closingBalance, language)}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>
        </AuthenticatedLayout>
    );
}
