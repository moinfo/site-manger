import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Paper,
    TextInput,
    Select,
    NumberInput,
    Button,
    Group,
    SimpleGrid,
    Text,
} from '@mantine/core';
import { Project } from '@/types';
import { formatMoney } from '@/utils/format';

interface Props {
    projects: Project[];
    categories: Record<string, string>;
}

export default function ExpenseCreate({ projects, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        quantity: 1,
        unit: '',
        unit_price: 0,
        category: 'other',
    });

    const subtotal = data.quantity * data.unit_price;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/expenses');
    };

    const projectOptions = projects.map(p => ({ value: String(p.id), label: p.name }));
    const categoryOptions = Object.entries(categories).map(([k, v]) => ({ value: k, label: v }));

    return (
        <AuthenticatedLayout header="Add Expense">
            <Head title="Add Expense" />

            <Paper shadow="xs" p="lg" radius="md" withBorder maw={700}>
                <form onSubmit={submit}>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                        <Select
                            label="Project"
                            data={projectOptions}
                            value={data.project_id}
                            onChange={(v) => setData('project_id', v || '')}
                            error={errors.project_id}
                            required
                            searchable
                        />
                        <TextInput
                            label="Date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            error={errors.date}
                            required
                        />
                    </SimpleGrid>

                    <TextInput
                        label="Description"
                        placeholder="e.g. TWIGA CEMENT"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                        required
                        mb="md"
                    />

                    <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                        <NumberInput
                            label="Quantity"
                            value={data.quantity}
                            onChange={(v) => setData('quantity', Number(v) || 0)}
                            error={errors.quantity}
                            min={0.01}
                            decimalScale={2}
                            required
                        />
                        <TextInput
                            label="Unit"
                            placeholder="BAGS, PCS, KGS, TRIP..."
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value.toUpperCase())}
                            error={errors.unit}
                        />
                        <NumberInput
                            label="Unit Price (TZS)"
                            value={data.unit_price}
                            onChange={(v) => setData('unit_price', Number(v) || 0)}
                            error={errors.unit_price}
                            min={0}
                            thousandSeparator=","
                            required
                        />
                    </SimpleGrid>

                    <Select
                        label="Category"
                        data={categoryOptions}
                        value={data.category}
                        onChange={(v) => setData('category', v || 'other')}
                        error={errors.category}
                        required
                        mb="md"
                    />

                    <Paper p="sm" bg="blue.0" radius="md" mb="lg">
                        <Text size="sm" c="dimmed">Subtotal</Text>
                        <Text size="xl" fw={700}>TZS {formatMoney(subtotal)}</Text>
                    </Paper>

                    <Group>
                        <Button type="submit" loading={processing}>Save Expense</Button>
                        <Button variant="subtle" component={Link} href="/expenses">Cancel</Button>
                    </Group>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
