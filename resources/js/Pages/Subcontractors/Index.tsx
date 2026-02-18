import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Table, Button, Group, Paper, Text, Badge } from '@mantine/core';
import { formatMoney } from '@/utils/format';
import { Subcontractor } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    subcontractors: Subcontractor[];
}

export default function SubcontractorsIndex({ subcontractors }: Props) {
    const { t, language } = useLanguage();

    return (
        <AuthenticatedLayout header={t.subcontractors.title}>
            <Head title={t.subcontractors.title} />

            <Group justify="flex-end" mb="md">
                <Button component={Link} href="/subcontractors/create">{t.subcontractors.addSubcontractor}</Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table.ScrollContainer minWidth={600}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t.common.name}</Table.Th>
                            <Table.Th>{t.common.phone}</Table.Th>
                            <Table.Th ta="right">{t.subcontractors.totalBilled}</Table.Th>
                            <Table.Th ta="right">{t.subcontractors.totalPaid}</Table.Th>
                            <Table.Th ta="right">{t.dashboard.balance}</Table.Th>
                            <Table.Th ta="center">{t.common.actions}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {subcontractors.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={6}>
                                    <Text ta="center" c="dimmed" py="lg">{t.subcontractors.noSubcontractors}</Text>
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
                                <Table.Td ta="right"><Text size="sm">{formatMoney(sub.total_billed || 0, language)}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm">{formatMoney(sub.total_paid || 0, language)}</Text></Table.Td>
                                <Table.Td ta="right">
                                    <Badge
                                        color={(sub.balance || 0) > 0 ? 'orange' : (sub.balance || 0) < 0 ? 'red' : 'green'}
                                        variant="light"
                                    >
                                        {formatMoney(Math.abs(sub.balance || 0), language)}
                                    </Badge>
                                </Table.Td>
                                <Table.Td ta="center">
                                    <Group gap="xs" justify="center">
                                        <Button component={Link} href={`/subcontractors/${sub.id}`} size="compact-xs" variant="subtle">{t.common.view}</Button>
                                        <Button component={Link} href={`/subcontractors/${sub.id}/edit`} size="compact-xs" variant="subtle">{t.common.edit}</Button>
                                        <Button
                                            size="compact-xs" variant="subtle" color="red"
                                            onClick={() => { if (confirm(t.subcontractors.deleteConfirm)) router.delete(`/subcontractors/${sub.id}`); }}
                                        >{t.common.delete}</Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
                </Table.ScrollContainer>
            </Paper>
        </AuthenticatedLayout>
    );
}
