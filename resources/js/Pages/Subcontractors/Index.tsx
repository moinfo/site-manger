import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Table, Button, Group, Paper, Text, Badge } from '@mantine/core';
import { formatMoney } from '@/utils/format';
import { Subcontractor } from '@/types';

interface Props {
    subcontractors: Subcontractor[];
}

export default function SubcontractorsIndex({ subcontractors }: Props) {
    return (
        <AuthenticatedLayout header="Subcontractors">
            <Head title="Subcontractors" />

            <Group justify="flex-end" mb="md">
                <Button component={Link} href="/subcontractors/create">+ Add Subcontractor</Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th ta="right">Total Billed</Table.Th>
                            <Table.Th ta="right">Total Paid</Table.Th>
                            <Table.Th ta="right">Balance</Table.Th>
                            <Table.Th ta="center">Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {subcontractors.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={6}>
                                    <Text ta="center" c="dimmed" py="lg">No subcontractors yet.</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                        {subcontractors.map((sub) => (
                            <Table.Tr key={sub.id}>
                                <Table.Td>
                                    <Link href={`/subcontractors/${sub.id}`}>
                                        <Text size="sm" fw={500} c="blue">{sub.name}</Text>
                                    </Link>
                                </Table.Td>
                                <Table.Td><Text size="sm">{sub.phone || '-'}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm">{formatMoney(sub.total_billed || 0)}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm">{formatMoney(sub.total_paid || 0)}</Text></Table.Td>
                                <Table.Td ta="right">
                                    <Badge
                                        color={(sub.balance || 0) > 0 ? 'orange' : (sub.balance || 0) < 0 ? 'red' : 'green'}
                                        variant="light"
                                    >
                                        {formatMoney(Math.abs(sub.balance || 0))}
                                    </Badge>
                                </Table.Td>
                                <Table.Td ta="center">
                                    <Group gap="xs" justify="center">
                                        <Button component={Link} href={`/subcontractors/${sub.id}`} size="compact-xs" variant="subtle">View</Button>
                                        <Button component={Link} href={`/subcontractors/${sub.id}/edit`} size="compact-xs" variant="subtle">Edit</Button>
                                        <Button
                                            size="compact-xs" variant="subtle" color="red"
                                            onClick={() => { if (confirm('Delete?')) router.delete(`/subcontractors/${sub.id}`); }}
                                        >Delete</Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>
        </AuthenticatedLayout>
    );
}
