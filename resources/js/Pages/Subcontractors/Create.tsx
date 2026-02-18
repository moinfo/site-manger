import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Paper, TextInput, Textarea, Button, Group, Stack } from '@mantine/core';

export default function SubcontractorCreate() {
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
        <AuthenticatedLayout header="Add Subcontractor">
            <Head title="Add Subcontractor" />
            <Paper shadow="xs" p="lg" radius="md" withBorder maw={500}>
                <form onSubmit={submit}>
                    <Stack>
                        <TextInput label="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
                        <TextInput label="Phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                        <Textarea label="Notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} error={errors.notes} />
                        <Group>
                            <Button type="submit" loading={processing}>Save</Button>
                            <Button variant="subtle" component={Link} href="/subcontractors">Cancel</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
