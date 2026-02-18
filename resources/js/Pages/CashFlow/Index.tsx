import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Paper, SimpleGrid, Text, Table, Button, Group, TextInput,
    NumberInput, Select, Modal, Stack, Badge, Pagination,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { formatMoney, formatDate } from '@/utils/format';
import { CashInflow, PaginatedData, Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface MonthlySummary {
    month: string;
    cash_in: number;
    cash_out: number;
}

interface Props {
    inflows: PaginatedData<CashInflow>;
    monthlySummary: MonthlySummary[];
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

export default function CashFlowIndex({ inflows, monthlySummary, totalIn, totalOut, balance, projects, filters }: Props) {
    const { t, language } = useLanguage();
    const [opened, handlers] = useDisclosure(false);
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilters = () => {
        router.get('/cashflow', {
            project_id: projectId || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setProjectId('');
        setDateFrom('');
        setDateTo('');
        router.get('/cashflow');
    };

    const form = useForm({
        project_id: '',
        date: new Date().toISOString().split('T')[0],
        source: '',
        amount: 0,
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/cashflow', {
            onSuccess: () => { handlers.close(); form.reset(); },
        });
    };

    const projectOptions = projects.map(p => ({ value: String(p.id), label: p.name }));

    return (
        <AuthenticatedLayout header={t.cashFlow.title}>
            <Head title={t.cashFlow.title} />

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

            {/* Monthly Summary */}
            <Paper shadow="xs" p="md" radius="md" withBorder mb="lg">
                <Text fw={600} mb="md">{t.cashFlow.monthlySummary}</Text>
                <Table.ScrollContainer minWidth={500}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t.cashFlow.month}</Table.Th>
                            <Table.Th ta="right">{t.cashFlow.cashIn}</Table.Th>
                            <Table.Th ta="right">{t.cashFlow.cashOut}</Table.Th>
                            <Table.Th ta="right">{t.cashFlow.net}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {monthlySummary.map((row) => {
                            const net = Number(row.cash_in) - Number(row.cash_out);
                            return (
                                <Table.Tr key={row.month}>
                                    <Table.Td><Text size="sm" fw={500}>{row.month}</Text></Table.Td>
                                    <Table.Td ta="right"><Text size="sm" c="green">{formatMoney(Number(row.cash_in), language)}</Text></Table.Td>
                                    <Table.Td ta="right"><Text size="sm" c="orange">{formatMoney(Number(row.cash_out), language)}</Text></Table.Td>
                                    <Table.Td ta="right">
                                        <Badge color={net >= 0 ? 'green' : 'red'} variant="light">
                                            {net >= 0 ? '+' : ''}{formatMoney(net, language)}
                                        </Badge>
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
                </Table.ScrollContainer>
            </Paper>

            {/* Cash Inflows */}
            <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">{t.cashFlow.cashInflows}</Text>
                <Button size="xs" onClick={handlers.open}>{t.cashFlow.recordCashIn}</Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table.ScrollContainer minWidth={650}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t.common.date}</Table.Th>
                            <Table.Th>{t.cashFlow.source}</Table.Th>
                            <Table.Th>{t.expenses.project}</Table.Th>
                            <Table.Th ta="right">{t.cashFlow.amount}</Table.Th>
                            <Table.Th>{t.common.notes}</Table.Th>
                            <Table.Th ta="center">{t.common.actions}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {inflows.data.map((inflow) => (
                            <Table.Tr key={inflow.id}>
                                <Table.Td><Text size="sm">{formatDate(inflow.date, language)}</Text></Table.Td>
                                <Table.Td><Text size="sm" fw={500}>{inflow.source}</Text></Table.Td>
                                <Table.Td><Text size="sm">{inflow.project?.name}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={600} c="green">{formatMoney(inflow.amount, language)}</Text></Table.Td>
                                <Table.Td><Text size="sm" c="dimmed">{inflow.notes || '-'}</Text></Table.Td>
                                <Table.Td ta="center">
                                    <Button
                                        size="compact-xs" variant="subtle" color="red"
                                        onClick={() => { if (confirm(t.cashFlow.deleteConfirm)) router.delete(`/cashflow/${inflow.id}`); }}
                                    >{t.common.delete}</Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
                </Table.ScrollContainer>
            </Paper>

            {inflows.last_page > 1 && (
                <Group justify="center" mt="md">
                    <Pagination
                        total={inflows.last_page}
                        value={inflows.current_page}
                        onChange={(page) => router.get('/cashflow', { ...filters, page }, { preserveState: true })}
                    />
                </Group>
            )}

            {/* Add Inflow Modal */}
            <Modal opened={opened} onClose={handlers.close} title={t.cashFlow.recordCashReceived}>
                <form onSubmit={submit}>
                    <Stack>
                        <Select label={t.expenses.project} data={projectOptions} value={form.data.project_id} onChange={(v) => form.setData('project_id', v || '')} required searchable />
                        <DatePicker label={t.common.date} value={form.data.date} onChange={(v) => form.setData('date', v)} required />
                        <TextInput label={t.cashFlow.source} placeholder={t.cashFlow.sourcePlaceholder} value={form.data.source} onChange={(e) => form.setData('source', e.target.value)} required />
                        <NumberInput label={t.subcontractors.amountTzs} value={form.data.amount} onChange={(v) => form.setData('amount', Number(v) || 0)} min={0.01} thousandSeparator="," required />
                        <TextInput label={t.common.notes} value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                        <Button type="submit" loading={form.processing}>{t.common.save}</Button>
                    </Stack>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
