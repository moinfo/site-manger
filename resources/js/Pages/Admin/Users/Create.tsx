import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, PasswordInput, Select, Button, Group, Stack } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';

export default function UserCreate() {
    const { t } = useLanguage();
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
        <AuthenticatedLayout header={t.users.addUser.replace('+ ', '')}>
            <Head title={t.users.addUser.replace('+ ', '')} />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={500}>
                <form onSubmit={submit}>
                    <Stack>
                        <TextInput label={t.common.name} value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
                        <TextInput label={t.common.email} type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} required />
                        <PasswordInput label={t.common.password} value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} required />
                        <PasswordInput label={t.common.confirmPassword} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        <Select label={t.common.role} data={[{ value: 'admin', label: t.users.admin }, { value: 'manager', label: t.users.manager }, { value: 'accountant', label: t.users.accountant }, { value: 'viewer', label: t.users.viewer }]} value={data.role} onChange={(v) => setData('role', v || 'viewer')} />
                        <Group>
                            <Button type="submit" loading={processing}>{t.users.createUser}</Button>
                            <Button variant="subtle" component={Link} href="/users">{t.common.cancel}</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
