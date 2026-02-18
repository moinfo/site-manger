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
}

export default function CashFlowIndex({ inflows, monthlySummary, totalIn, totalOut, balance, projects }: Props) {
    const [opened, handlers] = useDisclosure(false);

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
        <AuthenticatedLayout header="Cash Flow">
            <Head title="Cash Flow" />

            {/* Summary Cards */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Received</Text>
                    <Text size="xl" fw={700} c="green">TZS {formatMoney(totalIn)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Spent</Text>
                    <Text size="xl" fw={700} c="orange">TZS {formatMoney(totalOut)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Balance</Text>
                    <Text size="xl" fw={700} c={balance >= 0 ? 'green' : 'red'}>TZS {formatMoney(balance)}</Text>
                </Paper>
            </SimpleGrid>

            {/* Monthly Summary */}
            <Paper shadow="xs" p="md" radius="md" withBorder mb="lg">
                <Text fw={600} mb="md">Monthly Summary</Text>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Month</Table.Th>
                            <Table.Th ta="right">Cash In</Table.Th>
                            <Table.Th ta="right">Cash Out</Table.Th>
                            <Table.Th ta="right">Net</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {monthlySummary.map((row) => {
                            const net = Number(row.cash_in) - Number(row.cash_out);
                            return (
                                <Table.Tr key={row.month}>
                                    <Table.Td><Text size="sm" fw={500}>{row.month}</Text></Table.Td>
                                    <Table.Td ta="right"><Text size="sm" c="green">{formatMoney(Number(row.cash_in))}</Text></Table.Td>
                                    <Table.Td ta="right"><Text size="sm" c="orange">{formatMoney(Number(row.cash_out))}</Text></Table.Td>
                                    <Table.Td ta="right">
                                        <Badge color={net >= 0 ? 'green' : 'red'} variant="light">
                                            {net >= 0 ? '+' : ''}{formatMoney(net)}
                                        </Badge>
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
            </Paper>

            {/* Cash Inflows */}
            <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">Cash Inflows</Text>
                <Button size="xs" onClick={handlers.open}>+ Record Cash In</Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Source</Table.Th>
                            <Table.Th>Project</Table.Th>
                            <Table.Th ta="right">Amount</Table.Th>
                            <Table.Th>Notes</Table.Th>
                            <Table.Th ta="center">Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {inflows.data.map((inflow) => (
                            <Table.Tr key={inflow.id}>
                                <Table.Td><Text size="sm">{formatDate(inflow.date)}</Text></Table.Td>
                                <Table.Td><Text size="sm" fw={500}>{inflow.source}</Text></Table.Td>
                                <Table.Td><Text size="sm">{inflow.project?.name}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={600} c="green">{formatMoney(inflow.amount)}</Text></Table.Td>
                                <Table.Td><Text size="sm" c="dimmed">{inflow.notes || '-'}</Text></Table.Td>
                                <Table.Td ta="center">
                                    <Button
                                        size="compact-xs" variant="subtle" color="red"
                                        onClick={() => { if (confirm('Delete?')) router.delete(`/cashflow/${inflow.id}`); }}
                                    >Delete</Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>

            {inflows.last_page > 1 && (
                <Group justify="center" mt="md">
                    <Pagination
                        total={inflows.last_page}
                        value={inflows.current_page}
                        onChange={(page) => router.get('/cashflow', { page }, { preserveState: true })}
                    />
                </Group>
            )}

            {/* Add Inflow Modal */}
            <Modal opened={opened} onClose={handlers.close} title="Record Cash Received">
                <form onSubmit={submit}>
                    <Stack>
                        <Select label="Project" data={projectOptions} value={form.data.project_id} onChange={(v) => form.setData('project_id', v || '')} required searchable />
                        <TextInput label="Date" type="date" value={form.data.date} onChange={(e) => form.setData('date', e.target.value)} required />
                        <TextInput label="Source" placeholder="e.g. Wildedge Safaris Ltd" value={form.data.source} onChange={(e) => form.setData('source', e.target.value)} required />
                        <NumberInput label="Amount (TZS)" value={form.data.amount} onChange={(v) => form.setData('amount', Number(v) || 0)} min={0.01} thousandSeparator="," required />
                        <TextInput label="Notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                        <Button type="submit" loading={form.processing}>Save</Button>
                    </Stack>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
