import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, Textarea, Button, Group, Stack } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SubcontractorCreate() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/subcontractors');
    };

    return (
        <AuthenticatedLayout header={t.subcontractors.addSubcontractor.replace('+ ', '')}>
            <Head title={t.subcontractors.addSubcontractor.replace('+ ', '')} />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={500}>
                <form onSubmit={submit}>
                    <Stack>
                        <TextInput label={t.common.name} value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
                        <TextInput label={t.common.phone} value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                        <Textarea label={t.common.notes} value={data.notes} onChange={(e) => setData('notes', e.target.value)} error={errors.notes} />
                        <Group>
                            <Button type="submit" loading={processing}>{t.common.save}</Button>
                            <Button variant="subtle" component={Link} href="/subcontractors">{t.common.cancel}</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
