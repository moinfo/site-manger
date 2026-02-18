import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, PasswordInput, Select, Button, Group, Stack } from '@mantine/core';
import { User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    editUser: User;
}

export default function UserEdit({ editUser }: Props) {
    const { t } = useLanguage();
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
        <AuthenticatedLayout header={t.users.editUser}>
            <Head title={t.users.editUser} />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={500}>
                <form onSubmit={submit}>
                    <Stack>
                        <TextInput label={t.common.name} value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
                        <TextInput label={t.common.email} type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} required />
                        <PasswordInput label={t.users.newPassword} description={t.users.newPasswordDesc} value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} />
                        <PasswordInput label={t.common.confirmPassword} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        <Select label={t.common.role} data={[{ value: 'admin', label: t.users.admin }, { value: 'manager', label: t.users.manager }, { value: 'accountant', label: t.users.accountant }, { value: 'viewer', label: t.users.viewer }]} value={data.role} onChange={(v) => setData('role', (v || 'viewer') as any)} />
                        <Group>
                            <Button type="submit" loading={processing}>{t.users.updateUser}</Button>
                            <Button variant="subtle" component={Link} href="/users">{t.common.cancel}</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
