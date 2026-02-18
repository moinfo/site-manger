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
import { Material, Project } from '@/types';
import { formatMoney } from '@/utils/format';

interface Props {
    expense: Material;
    projects: Project[];
    categories: Record<string, string>;
}

export default function ExpenseEdit({ expense, projects, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: String(expense.project_id),
        date: expense.date.split('T')[0],
        description: expense.description,
        quantity: expense.quantity,
        unit: expense.unit || '',
        unit_price: expense.unit_price,
        category: expense.category,
    });

    const subtotal = data.quantity * data.unit_price;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/expenses/${expense.id}`);
    };

    const projectOptions = projects.map(p => ({ value: String(p.id), label: p.name }));
    const categoryOptions = Object.entries(categories).map(([k, v]) => ({ value: k, label: v }));

    return (
        <AuthenticatedLayout header="Edit Expense">
            <Head title="Edit Expense" />

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
                        <Button type="submit" loading={processing}>Update Expense</Button>
                        <Button variant="subtle" component={Link} href="/expenses">Cancel</Button>
                    </Group>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
