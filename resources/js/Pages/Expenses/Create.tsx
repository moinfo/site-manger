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
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Props {
    projects: Project[];
    categories: Record<string, string>;
}

export default function ExpenseCreate({ projects, categories }: Props) {
    const { t, language } = useLanguage();
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
        <AuthenticatedLayout header={t.expenses.addExpense.replace('+ ', '')}>
            <Head title={t.expenses.addExpense.replace('+ ', '')} />

            <Paper shadow="xs" p="lg" radius="md" withBorder maw={700}>
                <form onSubmit={submit}>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                        <Select
                            label={t.expenses.project}
                            data={projectOptions}
                            value={data.project_id}
                            onChange={(v) => setData('project_id', v || '')}
                            error={errors.project_id}
                            required
                            searchable
                        />
                        <DatePicker
                            label={t.common.date}
                            value={data.date}
                            onChange={(v) => setData('date', v)}
                            error={errors.date}
                            required
                        />
                    </SimpleGrid>

                    <TextInput
                        label={t.expenses.description}
                        placeholder="e.g. TWIGA CEMENT"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                        required
                        mb="md"
                    />

                    <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                        <NumberInput
                            label={t.expenses.qty}
                            value={data.quantity}
                            onChange={(v) => setData('quantity', Number(v) || 0)}
                            error={errors.quantity}
                            min={0.01}
                            decimalScale={2}
                            required
                        />
                        <TextInput
                            label={t.expenses.unit}
                            placeholder="BAGS, PCS, KGS, TRIP..."
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value.toUpperCase())}
                            error={errors.unit}
                        />
                        <NumberInput
                            label={t.expenses.unitPriceTzs}
                            value={data.unit_price}
                            onChange={(v) => setData('unit_price', Number(v) || 0)}
                            error={errors.unit_price}
                            min={0}
                            thousandSeparator=","
                            required
                        />
                    </SimpleGrid>

                    <Select
                        label={t.expenses.category}
                        data={categoryOptions}
                        value={data.category}
                        onChange={(v) => setData('category', v || 'other')}
                        error={errors.category}
                        required
                        mb="md"
                    />

                    <Paper p="sm" radius="md" mb="lg" style={{ backgroundColor: 'var(--mantine-color-blue-light)' }}>
                        <Text size="sm" c="dimmed">{t.expenses.subtotal}</Text>
                        <Text size="xl" fw={700}>TZS {formatMoney(subtotal, language)}</Text>
                    </Paper>

                    <Group>
                        <Button type="submit" loading={processing}>{t.expenses.saveExpense}</Button>
                        <Button variant="subtle" component={Link} href="/expenses">{t.common.cancel}</Button>
                    </Group>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
