import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, Select, NumberInput, Button, Group, SimpleGrid } from '@mantine/core';
import { Project } from '@/types';

interface Props {
    project: Project;
}

export default function ProjectEdit({ project }: Props) {
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
        <AuthenticatedLayout header="Edit Project">
            <Head title="Edit Project" />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={600}>
                <form onSubmit={submit}>
                    <TextInput label="Project Name" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required mb="md" />
                    <TextInput label="Location" value={data.location} onChange={(e) => setData('location', e.target.value)} error={errors.location} mb="md" />
                    <SimpleGrid cols={2} mb="md">
                        <TextInput label="Start Date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} error={errors.start_date} />
                        <TextInput label="End Date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} error={errors.end_date} />
                    </SimpleGrid>
                    <SimpleGrid cols={2} mb="md">
                        <NumberInput label="Budget (TZS)" value={data.budget} onChange={(v) => setData('budget', Number(v) || 0)} error={errors.budget} min={0} thousandSeparator="," />
                        <Select label="Status" data={[{ value: 'active', label: 'Active' }, { value: 'on_hold', label: 'On Hold' }, { value: 'completed', label: 'Completed' }]} value={data.status} onChange={(v) => setData('status', (v || 'active') as any)} error={errors.status} />
                    </SimpleGrid>
                    <Group>
                        <Button type="submit" loading={processing}>Update Project</Button>
                        <Button variant="subtle" component={Link} href="/projects">Cancel</Button>
                    </Group>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
