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
} from '@mantine/core';
import { Project, ChargeCategory, FinancialCharge } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Props {
    charge: FinancialCharge;
    projects: Project[];
    categories: ChargeCategory[];
}

export default function ChargeEdit({ charge, projects, categories }: Props) {
    const { t } = useLanguage();
    const { data, setData, put, processing, errors } = useForm({
        project_id: String(charge.project_id),
        charge_category_id: String(charge.charge_category_id),
        date: charge.date,
        amount: Number(charge.amount),
        description: charge.description,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/charges/${charge.id}`);
    };

    const projectOptions = projects.map(p => ({ value: String(p.id), label: p.name }));
    const categoryOptions = categories.map(c => ({ value: String(c.id), label: c.name }));

    return (
        <AuthenticatedLayout header={t.charges.editCharge}>
            <Head title={t.charges.editCharge} />

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
                        <Select
                            label={t.expenses.category}
                            data={categoryOptions}
                            value={data.charge_category_id}
                            onChange={(v) => setData('charge_category_id', v || '')}
                            error={errors.charge_category_id}
                            required
                            searchable
                        />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                        <DatePicker
                            label={t.common.date}
                            value={data.date}
                            onChange={(v) => setData('date', v)}
                            error={errors.date}
                            required
                        />
                        <NumberInput
                            label={t.charges.amount}
                            value={data.amount}
                            onChange={(v) => setData('amount', Number(v) || 0)}
                            error={errors.amount}
                            min={0.01}
                            thousandSeparator=","
                            required
                        />
                    </SimpleGrid>

                    <TextInput
                        label={t.charges.description}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                        required
                        mb="lg"
                    />

                    <Group>
                        <Button type="submit" loading={processing}>{t.charges.updateCharge}</Button>
                        <Button variant="subtle" component={Link} href="/charges">{t.common.cancel}</Button>
                    </Group>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
