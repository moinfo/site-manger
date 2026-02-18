import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, Select, NumberInput, Button, Group, SimpleGrid } from '@mantine/core';
import { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Props {
    project: Project;
}

export default function ProjectEdit({ project }: Props) {
    const { t } = useLanguage();
    const { data, setData, put, processing, errors } = useForm({
        name: project.name,
        location: project.location || '',
        start_date: project.start_date?.split('T')[0] || '',
        end_date: project.end_date?.split('T')[0] || '',
        budget: project.budget,
        status: project.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/projects/${project.id}`);
    };

    return (
        <AuthenticatedLayout header={t.projects.editProject}>
            <Head title={t.projects.editProject} />
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
                        <Select label={t.common.status} data={[{ value: 'active', label: t.projects.active }, { value: 'on_hold', label: t.projects.onHold }, { value: 'completed', label: t.projects.completed }]} value={data.status} onChange={(v) => setData('status', (v || 'active') as any)} error={errors.status} />
                    </SimpleGrid>
                    <Group>
                        <Button type="submit" loading={processing}>{t.projects.updateProject}</Button>
                        <Button variant="subtle" component={Link} href="/projects">{t.common.cancel}</Button>
                    </Group>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
