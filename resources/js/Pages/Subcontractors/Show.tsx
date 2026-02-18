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
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Props {
    subcontractor: Subcontractor & { contracts: (Contract & { payments: any[]; project: Project })[] };
    projects: Project[];
}

export default function SubcontractorShow({ subcontractor, projects }: Props) {
    const { t, language } = useLanguage();
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
                <Button variant="light" component={Link} href={`/subcontractors/${subcontractor.id}/edit`}>{t.subcontractors.editSubcontractor}</Button>
            </Group>

            {/* Summary */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.subcontractors.totalBilled}</Text>
                    <Text size="xl" fw={700}>TZS {formatMoney(totalBilled, language)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.subcontractors.totalPaid}</Text>
                    <Text size="xl" fw={700} c="green">TZS {formatMoney(totalPaid, language)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.subcontractors.balanceOwed}</Text>
                    <Text size="xl" fw={700} c={totalBilled - totalPaid > 0 ? 'orange' : 'green'}>
                        TZS {formatMoney(totalBilled - totalPaid, language)}
                    </Text>
                </Paper>
            </SimpleGrid>

            {/* Contracts */}
            <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">{t.subcontractors.contracts}</Text>
                <Button size="xs" onClick={contractModalHandlers.open}>{t.subcontractors.addContract}</Button>
            </Group>

            {subcontractor.contracts?.map((contract) => {
                const contractPaid = contract.payments?.reduce((s: number, p: any) => s + Number(p.amount), 0) || 0;
                const statusLabel: Record<string, string> = {
                    pending: t.subcontractors.pending,
                    in_progress: t.subcontractors.inProgress,
                    completed: t.subcontractors.completed,
                };
                return (
                    <Paper key={contract.id} shadow="xs" p="md" radius="md" withBorder mb="md">
                        <Group justify="space-between" mb="sm" wrap="wrap" gap="xs">
                            <div>
                                <Text fw={600}>{contract.description}</Text>
                                <Text size="sm" c="dimmed">{contract.project?.name}</Text>
                            </div>
                            <Group gap="xs" wrap="wrap">
                                <Badge color={contract.status === 'completed' ? 'green' : contract.status === 'in_progress' ? 'blue' : 'gray'} variant="light">
                                    {statusLabel[contract.status] || contract.status}
                                </Badge>
                                <Text fw={700}>TZS {formatMoney(Number(contract.billed_amount), language)}</Text>
                            </Group>
                        </Group>

                        <SimpleGrid cols={{ base: 1, xs: 3 }} mb="sm">
                            <div>
                                <Text size="xs" c="dimmed">{t.dashboard.billed}</Text>
                                <Text size="sm" fw={600}>{formatMoney(Number(contract.billed_amount), language)}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">{t.dashboard.paid}</Text>
                                <Text size="sm" fw={600} c="green">{formatMoney(contractPaid, language)}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">{t.projects.remaining}</Text>
                                <Text size="sm" fw={600} c="orange">{formatMoney(Number(contract.billed_amount) - contractPaid, language)}</Text>
                            </div>
                        </SimpleGrid>

                        {contract.payments && contract.payments.length > 0 && (
                            <Table.ScrollContainer minWidth={400}>
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t.common.date}</Table.Th>
                                        <Table.Th ta="right">{t.cashFlow.amount}</Table.Th>
                                        <Table.Th>{t.common.notes}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {contract.payments.map((p: any) => (
                                        <Table.Tr key={p.id}>
                                            <Table.Td>{formatDate(p.date, language)}</Table.Td>
                                            <Table.Td ta="right">{formatMoney(Number(p.amount), language)}</Table.Td>
                                            <Table.Td>{p.notes || '-'}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                            </Table.ScrollContainer>
                        )}

                        <Group mt="sm">
                            <Button
                                size="compact-xs" variant="light"
                                onClick={() => { setActiveContractId(contract.id); paymentModalHandlers.open(); }}
                            >
                                {t.subcontractors.addPayment}
                            </Button>
                        </Group>
                    </Paper>
                );
            })}

            {/* Add Contract Modal */}
            <Modal opened={contractModal} onClose={contractModalHandlers.close} title={t.subcontractors.addContract.replace('+ ', '')}>
                <form onSubmit={submitContract}>
                    <Stack>
                        <Select label={t.expenses.project} data={projectOptions} value={contractForm.data.project_id} onChange={(v) => contractForm.setData('project_id', v || '')} required searchable />
                        <TextInput label={t.subcontractors.workDescription} value={contractForm.data.description} onChange={(e) => contractForm.setData('description', e.target.value)} required />
                        <NumberInput label={t.subcontractors.billedAmountTzs} value={contractForm.data.billed_amount} onChange={(v) => contractForm.setData('billed_amount', Number(v) || 0)} min={0} thousandSeparator="," required />
                        <Select label={t.common.status} data={[{ value: 'pending', label: t.subcontractors.pending }, { value: 'in_progress', label: t.subcontractors.inProgress }, { value: 'completed', label: t.subcontractors.completed }]} value={contractForm.data.status} onChange={(v) => contractForm.setData('status', v || 'in_progress')} />
                        <Button type="submit" loading={contractForm.processing}>{t.subcontractors.addContract.replace('+ ', '')}</Button>
                    </Stack>
                </form>
            </Modal>

            {/* Add Payment Modal */}
            <Modal opened={paymentModal} onClose={paymentModalHandlers.close} title={t.subcontractors.recordPayment}>
                <form onSubmit={submitPayment}>
                    <Stack>
                        <DatePicker label={t.common.date} value={paymentForm.data.date} onChange={(v) => paymentForm.setData('date', v)} required />
                        <NumberInput label={t.subcontractors.amountTzs} value={paymentForm.data.amount} onChange={(v) => paymentForm.setData('amount', Number(v) || 0)} min={0.01} thousandSeparator="," required />
                        <TextInput label={t.common.notes} value={paymentForm.data.notes} onChange={(e) => paymentForm.setData('notes', e.target.value)} />
                        <Button type="submit" loading={paymentForm.processing}>{t.subcontractors.recordPayment}</Button>
                    </Stack>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
