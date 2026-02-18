import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, Select, NumberInput, Button, Group, SimpleGrid } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

export default function ProjectCreate() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        location: '',
        start_date: '',
        end_date: '',
        budget: 0,
        status: 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects');
    };

    return (
        <AuthenticatedLayout header={t.projects.newProject}>
            <Head title={t.projects.newProject} />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={600}>
                <form onSubmit={submit}>
                    <TextInput label={t.projects.projectName} value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required mb="md" />
                    <TextInput label={t.common.location} value={data.location} onChange={(e) => setData('location', e.target.value)} error={errors.location} mb="md" />
                    <SimpleGrid cols={2} mb="md">
                        <DatePicker label={t.projects.startDate} value={data.start_date} onChange={(v) => setData('start_date', v)} error={errors.start_date} />
                        <DatePicker label={t.projects.endDate} value={data.end_date} onChange={(v) => setData('end_date', v)} error={errors.end_date} />
                    </SimpleGrid>
                    <SimpleGrid cols={2} mb="md">
                        <NumberInput label={t.projects.budgetTzs} value={data.budget} onChange={(v) => setData('budget', Number(v) || 0)} error={errors.budget} min={0} thousandSeparator="," />
                        <Select label={t.common.status} data={[{ value: 'active', label: t.projects.active }, { value: 'on_hold', label: t.projects.onHold }, { value: 'completed', label: t.projects.completed }]} value={data.status} onChange={(v) => setData('status', v || 'active')} error={errors.status} />
                    </SimpleGrid>
                    <Group>
                        <Button type="submit" loading={processing}>{t.projects.createProject}</Button>
                        <Button variant="subtle" component={Link} href="/projects">{t.common.cancel}</Button>
                    </Group>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
