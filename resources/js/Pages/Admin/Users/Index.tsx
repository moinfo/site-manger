import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Table, Button, Group, Paper, Text, Badge } from '@mantine/core';
import { User } from '@/types';

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
    return (
        <AuthenticatedLayout header="Users">
            <Head title="Users" />

            <Group justify="flex-end" mb="md">
                <Button component={Link} href="/users/create">+ Add User</Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th ta="center">Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {users.map((user) => (
                            <Table.Tr key={user.id}>
                                <Table.Td><Text size="sm" fw={500}>{user.name}</Text></Table.Td>
                                <Table.Td><Text size="sm">{user.email}</Text></Table.Td>
                                <Table.Td>
                                    <Badge color={roleColor[user.role]} variant="light" size="sm">
                                        {user.role}
                                    </Badge>
                                </Table.Td>
                                <Table.Td ta="center">
                                    <Group gap="xs" justify="center">
                                        <Button component={Link} href={`/users/${user.id}/edit`} size="compact-xs" variant="subtle">Edit</Button>
                                        <Button
                                            size="compact-xs" variant="subtle" color="red"
                                            onClick={() => { if (confirm('Delete this user?')) router.delete(`/users/${user.id}`); }}
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
