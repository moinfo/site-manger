import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, PasswordInput, Select, Button, Group, Stack } from '@mantine/core';

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'viewer',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AuthenticatedLayout header="Add User">
            <Head title="Add User" />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={500}>
                <form onSubmit={submit}>
                    <Stack>
                        <TextInput label="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
                        <TextInput label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} required />
                        <PasswordInput label="Password" value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} required />
                        <PasswordInput label="Confirm Password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        <Select label="Role" data={[{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'accountant', label: 'Accountant' }, { value: 'viewer', label: 'Viewer' }]} value={data.role} onChange={(v) => setData('role', v || 'viewer')} />
                        <Group>
                            <Button type="submit" loading={processing}>Create User</Button>
                            <Button variant="subtle" component={Link} href="/users">Cancel</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
