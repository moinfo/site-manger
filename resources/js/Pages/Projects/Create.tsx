import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, Select, NumberInput, Button, Group, SimpleGrid } from '@mantine/core';

export default function ProjectCreate() {
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
        <AuthenticatedLayout header="New Project">
            <Head title="New Project" />
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
                        <Select label="Status" data={[{ value: 'active', label: 'Active' }, { value: 'on_hold', label: 'On Hold' }, { value: 'completed', label: 'Completed' }]} value={data.status} onChange={(v) => setData('status', v || 'active')} error={errors.status} />
                    </SimpleGrid>
                    <Group>
                        <Button type="submit" loading={processing}>Create Project</Button>
                        <Button variant="subtle" component={Link} href="/projects">Cancel</Button>
                    </Group>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
