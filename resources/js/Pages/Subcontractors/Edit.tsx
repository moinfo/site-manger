import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, Textarea, Button, Group, Stack } from '@mantine/core';
import { Subcontractor } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    subcontractor: Subcontractor;
}

export default function SubcontractorEdit({ subcontractor }: Props) {
    const { t } = useLanguage();
    const { data, setData, put, processing, errors } = useForm({
        name: subcontractor.name,
        phone: subcontractor.phone || '',
        notes: subcontractor.notes || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/subcontractors/${subcontractor.id}`);
    };

    return (
        <AuthenticatedLayout header={t.subcontractors.editSubcontractor}>
            <Head title={t.subcontractors.editSubcontractor} />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={500}>
                <form onSubmit={submit}>
                    <Stack>
                        <TextInput label={t.common.name} value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
                        <TextInput label={t.common.phone} value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                        <Textarea label={t.common.notes} value={data.notes} onChange={(e) => setData('notes', e.target.value)} error={errors.notes} />
                        <Group>
                            <Button type="submit" loading={processing}>{t.subcontractors.update}</Button>
                            <Button variant="subtle" component={Link} href={`/subcontractors/${subcontractor.id}`}>{t.common.cancel}</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
