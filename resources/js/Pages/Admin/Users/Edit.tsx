import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, PasswordInput, Select, Button, Group, Stack, Text } from '@mantine/core';
import { User } from '@/types';

interface Props {
    editUser: User;
}

export default function UserEdit({ editUser }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: editUser.name,
        email: editUser.email,
        password: '',
        password_confirmation: '',
        role: editUser.role,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${editUser.id}`);
    };

    return (
        <AuthenticatedLayout header="Edit User">
            <Head title="Edit User" />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={500}>
                <form onSubmit={submit}>
                    <Stack>
                        <TextInput label="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
                        <TextInput label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} required />
                        <PasswordInput label="New Password" description="Leave blank to keep current password" value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} />
                        <PasswordInput label="Confirm Password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        <Select label="Role" data={[{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'accountant', label: 'Accountant' }, { value: 'viewer', label: 'Viewer' }]} value={data.role} onChange={(v) => setData('role', (v || 'viewer') as any)} />
                        <Group>
                            <Button type="submit" loading={processing}>Update User</Button>
                            <Button variant="subtle" component={Link} href="/users">Cancel</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
