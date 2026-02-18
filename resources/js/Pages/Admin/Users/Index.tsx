import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Table, Button, Group, Paper, Text, Badge } from '@mantine/core';
import { User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    users: User[];
}

const roleColor: Record<string, string> = {
    admin: 'red',
    manager: 'blue',
    accountant: 'green',
    viewer: 'gray',
};

export default function UsersIndex({ users }: Props) {
    const { t } = useLanguage();

    const roleLabel: Record<string, string> = {
        admin: t.users.admin,
        manager: t.users.manager,
        accountant: t.users.accountant,
        viewer: t.users.viewer,
    };

    return (
        <AuthenticatedLayout header={t.users.title}>
            <Head title={t.users.title} />

            <Group justify="flex-end" mb="md">
                <Button component={Link} href="/users/create">{t.users.addUser}</Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table.ScrollContainer minWidth={500}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t.common.name}</Table.Th>
                            <Table.Th>{t.common.email}</Table.Th>
                            <Table.Th>{t.common.role}</Table.Th>
                            <Table.Th ta="center">{t.common.actions}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {users.map((user) => (
                            <Table.Tr key={user.id}>
                                <Table.Td><Text size="sm" fw={500}>{user.name}</Text></Table.Td>
                                <Table.Td><Text size="sm">{user.email}</Text></Table.Td>
                                <Table.Td>
                                    <Badge color={roleColor[user.role]} variant="light" size="sm">
                                        {roleLabel[user.role] || user.role}
                                    </Badge>
                                </Table.Td>
                                <Table.Td ta="center">
                                    <Group gap="xs" justify="center">
                                        <Button component={Link} href={`/users/${user.id}/edit`} size="compact-xs" variant="subtle">{t.common.edit}</Button>
                                        <Button
                                            size="compact-xs" variant="subtle" color="red"
                                            onClick={() => { if (confirm(t.users.deleteConfirm)) router.delete(`/users/${user.id}`); }}
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
