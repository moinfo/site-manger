import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Paper, Text, Table, Button, Badge, Group, Select, SimpleGrid } from '@mantine/core';
import { formatMoney } from '@/utils/format';
import { Subcontractor, Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Props {
    subcontractors: Subcontractor[];
    projects: Project[];
    filters: {
        project_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

const statusColor: Record<string, string> = {
    pending: 'yellow',
    in_progress: 'blue',
    completed: 'green',
    cancelled: 'gray',
};

export default function SubcontractorSummary({ subcontractors, projects, filters }: Props) {
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
        router.get('/reports/subcontractors', {
            project_id: projectId || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setProjectId('');
        setDateFrom('');
        setDateTo('');
        router.get('/reports/subcontractors');
    };

    return (
        <AuthenticatedLayout header={t.reports.subcontractorSummary}>
            <Head title={t.reports.subcontractorSummary} />

            <Group justify="space-between" mb="lg">
                <Button component={Link} href="/reports" variant="subtle" size="xs">
                    &larr; {t.reports.backToReports}
                </Button>
                <Group>
                    <Button component="a" href={exportUrl('subcontractors-pdf')} variant="light" size="xs">
                        {t.common.downloadPdf}
                    </Button>
                    <Button component="a" href={exportUrl('subcontractors-excel')} variant="light" size="xs" color="green">
                        {t.common.downloadExcel}
                    </Button>
                </Group>
            </Group>

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

            {subcontractors.map((sub) => {
                const totalBilled = (sub.contracts ?? []).reduce((s, c) => s + Number(c.billed_amount), 0);
                const totalPaid = (sub.contracts ?? []).reduce(
                    (s, c) => s + (c.payments ?? []).reduce((ps, p) => ps + Number(p.amount), 0), 0
                );
                const totalBalance = totalBilled - totalPaid;

                return (
                    <Paper key={sub.id} shadow="xs" p="md" radius="md" withBorder mb="md">
                        <Group justify="space-between" mb="sm">
                            <Text fw={600} size="lg">{sub.name}</Text>
                            <Text size="sm" c={totalBalance > 0 ? 'orange' : 'green'} fw={600}>
                                {t.reports.balance}: TZS {formatMoney(totalBalance, language)}
                            </Text>
                        </Group>

                        {(sub.contracts ?? []).length > 0 ? (
                            <Table.ScrollContainer minWidth={500}>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>{t.reports.contract}</Table.Th>
                                            <Table.Th ta="right">{t.reports.billed}</Table.Th>
                                            <Table.Th ta="right">{t.reports.paid}</Table.Th>
                                            <Table.Th ta="right">{t.reports.balance}</Table.Th>
                                            <Table.Th ta="center">{t.common.status}</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {sub.contracts!.map((c) => {
                                            const paid = (c.payments ?? []).reduce((s, p) => s + Number(p.amount), 0);
                                            const bal = Number(c.billed_amount) - paid;
                                            return (
                                                <Table.Tr key={c.id}>
                                                    <Table.Td><Text size="sm">{c.description}</Text></Table.Td>
                                                    <Table.Td ta="right"><Text size="sm">{formatMoney(Number(c.billed_amount), language)}</Text></Table.Td>
                                                    <Table.Td ta="right"><Text size="sm" c="green">{formatMoney(paid, language)}</Text></Table.Td>
                                                    <Table.Td ta="right"><Text size="sm" c={bal > 0 ? 'orange' : 'green'} fw={600}>{formatMoney(bal, language)}</Text></Table.Td>
                                                    <Table.Td ta="center">
                                                        <Badge color={statusColor[c.status] ?? 'gray'} variant="light" size="sm">
                                                            {c.status}
                                                        </Badge>
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        })}
                                        <Table.Tr>
                                            <Table.Td><Text size="sm" fw={700}>{t.common.total}</Text></Table.Td>
                                            <Table.Td ta="right"><Text size="sm" fw={700}>{formatMoney(totalBilled, language)}</Text></Table.Td>
                                            <Table.Td ta="right"><Text size="sm" fw={700} c="green">{formatMoney(totalPaid, language)}</Text></Table.Td>
                                            <Table.Td ta="right"><Text size="sm" fw={700} c={totalBalance > 0 ? 'orange' : 'green'}>{formatMoney(totalBalance, language)}</Text></Table.Td>
                                            <Table.Td />
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        ) : (
                            <Text size="sm" c="dimmed">{t.common.noDataYet}</Text>
                        )}
                    </Paper>
                );
            })}

            {subcontractors.length === 0 && (
                <Paper shadow="xs" p="xl" radius="md" withBorder>
                    <Text ta="center" c="dimmed">{t.common.noDataYet}</Text>
                </Paper>
            )}
        </AuthenticatedLayout>
    );
}
