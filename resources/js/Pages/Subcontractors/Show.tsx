import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Paper, SimpleGrid, Text, Table, Badge, Group, Button, TextInput,
    NumberInput, Select, Modal, Stack, Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { formatMoney, formatDate } from '@/utils/format';
import { Subcontractor, Contract, Project } from '@/types';

interface Props {
    subcontractor: Subcontractor & { contracts: (Contract & { payments: any[]; project: Project })[] };
    projects: Project[];
}

export default function SubcontractorShow({ subcontractor, projects }: Props) {
    const [contractModal, contractModalHandlers] = useDisclosure(false);
    const [paymentModal, paymentModalHandlers] = useDisclosure(false);
    const [activeContractId, setActiveContractId] = useState<number | null>(null);

    const totalBilled = subcontractor.contracts?.reduce((s, c) => s + Number(c.billed_amount), 0) || 0;
    const totalPaid = subcontractor.contracts?.reduce((s, c) => s + (c.payments?.reduce((ps: number, p: any) => ps + Number(p.amount), 0) || 0), 0) || 0;

    const contractForm = useForm({
        project_id: '',
        description: '',
        billed_amount: 0,
        status: 'in_progress',
    });

    const paymentForm = useForm({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        notes: '',
    });

    const submitContract = (e: React.FormEvent) => {
        e.preventDefault();
        contractForm.post(`/subcontractors/${subcontractor.id}/contracts`, {
            onSuccess: () => {
                contractModalHandlers.close();
                contractForm.reset();
            },
        });
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeContractId) return;
        paymentForm.post(`/contracts/${activeContractId}/payments`, {
            onSuccess: () => {
                paymentModalHandlers.close();
                paymentForm.reset();
            },
        });
    };

    const projectOptions = projects.map(p => ({ value: String(p.id), label: p.name }));

    return (
        <AuthenticatedLayout header={subcontractor.name}>
            <Head title={subcontractor.name} />

            <Group justify="flex-end" mb="md">
                <Button variant="light" component={Link} href={`/subcontractors/${subcontractor.id}/edit`}>Edit Subcontractor</Button>
            </Group>

            {/* Summary */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Billed</Text>
                    <Text size="xl" fw={700}>TZS {formatMoney(totalBilled)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Paid</Text>
                    <Text size="xl" fw={700} c="green">TZS {formatMoney(totalPaid)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Balance Owed</Text>
                    <Text size="xl" fw={700} c={totalBilled - totalPaid > 0 ? 'orange' : 'green'}>
                        TZS {formatMoney(totalBilled - totalPaid)}
                    </Text>
                </Paper>
            </SimpleGrid>

            {/* Contracts */}
            <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">Contracts</Text>
                <Button size="xs" onClick={contractModalHandlers.open}>+ Add Contract</Button>
            </Group>

            {subcontractor.contracts?.map((contract) => {
                const contractPaid = contract.payments?.reduce((s: number, p: any) => s + Number(p.amount), 0) || 0;
                return (
                    <Paper key={contract.id} shadow="xs" p="md" radius="md" withBorder mb="md">
                        <Group justify="space-between" mb="sm">
                            <div>
                                <Text fw={600}>{contract.description}</Text>
                                <Text size="sm" c="dimmed">{contract.project?.name}</Text>
                            </div>
                            <Group gap="xs">
                                <Badge color={contract.status === 'completed' ? 'green' : contract.status === 'in_progress' ? 'blue' : 'gray'} variant="light">
                                    {contract.status}
                                </Badge>
                                <Text fw={700}>TZS {formatMoney(Number(contract.billed_amount))}</Text>
                            </Group>
                        </Group>

                        <SimpleGrid cols={3} mb="sm">
                            <div>
                                <Text size="xs" c="dimmed">Billed</Text>
                                <Text size="sm" fw={600}>{formatMoney(Number(contract.billed_amount))}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">Paid</Text>
                                <Text size="sm" fw={600} c="green">{formatMoney(contractPaid)}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">Remaining</Text>
                                <Text size="sm" fw={600} c="orange">{formatMoney(Number(contract.billed_amount) - contractPaid)}</Text>
                            </div>
                        </SimpleGrid>

                        {contract.payments && contract.payments.length > 0 && (
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th ta="right">Amount</Table.Th>
                                        <Table.Th>Notes</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {contract.payments.map((p: any) => (
                                        <Table.Tr key={p.id}>
                                            <Table.Td>{formatDate(p.date)}</Table.Td>
                                            <Table.Td ta="right">{formatMoney(Number(p.amount))}</Table.Td>
                                            <Table.Td>{p.notes || '-'}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        )}

                        <Group mt="sm">
                            <Button
                                size="compact-xs" variant="light"
                                onClick={() => { setActiveContractId(contract.id); paymentModalHandlers.open(); }}
                            >
                                + Add Payment
                            </Button>
                        </Group>
                    </Paper>
                );
            })}

            {/* Add Contract Modal */}
            <Modal opened={contractModal} onClose={contractModalHandlers.close} title="Add Contract">
                <form onSubmit={submitContract}>
                    <Stack>
                        <Select label="Project" data={projectOptions} value={contractForm.data.project_id} onChange={(v) => contractForm.setData('project_id', v || '')} required searchable />
                        <TextInput label="Work Description" value={contractForm.data.description} onChange={(e) => contractForm.setData('description', e.target.value)} required />
                        <NumberInput label="Billed Amount (TZS)" value={contractForm.data.billed_amount} onChange={(v) => contractForm.setData('billed_amount', Number(v) || 0)} min={0} thousandSeparator="," required />
                        <Select label="Status" data={[{ value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }]} value={contractForm.data.status} onChange={(v) => contractForm.setData('status', v || 'in_progress')} />
                        <Button type="submit" loading={contractForm.processing}>Add Contract</Button>
                    </Stack>
                </form>
            </Modal>

            {/* Add Payment Modal */}
            <Modal opened={paymentModal} onClose={paymentModalHandlers.close} title="Record Payment">
                <form onSubmit={submitPayment}>
                    <Stack>
                        <TextInput label="Date" type="date" value={paymentForm.data.date} onChange={(e) => paymentForm.setData('date', e.target.value)} required />
                        <NumberInput label="Amount (TZS)" value={paymentForm.data.amount} onChange={(v) => paymentForm.setData('amount', Number(v) || 0)} min={0.01} thousandSeparator="," required />
                        <TextInput label="Notes" value={paymentForm.data.notes} onChange={(e) => paymentForm.setData('notes', e.target.value)} />
                        <Button type="submit" loading={paymentForm.processing}>Record Payment</Button>
                    </Stack>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
