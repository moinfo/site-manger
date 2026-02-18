import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Table,
    Button,
    Group,
    Select,
    Paper,
    Text,
    Badge,
    Pagination,
    SimpleGrid,
    Modal,
    TextInput,
    ActionIcon,
} from '@mantine/core';
import { useState } from 'react';
import { formatMoney, formatDate } from '@/utils/format';
import { FinancialCharge, ChargeCategory, PaginatedData, Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Props {
    charges: PaginatedData<FinancialCharge>;
    filters: {
        project_id?: string;
        charge_category_id?: string;
        date_from?: string;
        date_to?: string;
    };
    projects: Project[];
    categories: ChargeCategory[];
    totalFiltered: number;
}

export default function ChargesIndex({ charges, filters, projects, categories, totalFiltered }: Props) {
    const { t, language } = useLanguage();
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [categoryId, setCategoryId] = useState(filters.charge_category_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [modalOpen, setModalOpen] = useState(false);

    const categoryForm = useForm({ name: '' });

    const applyFilters = () => {
        router.get('/charges', {
            project_id: projectId || undefined,
            charge_category_id: categoryId || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setProjectId('');
        setCategoryId('');
        setDateFrom('');
        setDateTo('');
        router.get('/charges');
    };

    const projectOptions = projects.map(p => ({ value: String(p.id), label: p.name }));
    const categoryOptions = categories.map(c => ({ value: String(c.id), label: c.name }));

    const categoryMap: Record<number, string> = {};
    categories.forEach(c => { categoryMap[c.id] = c.name; });

    const addCategory = (e: React.FormEvent) => {
        e.preventDefault();
        categoryForm.post('/charge-categories', {
            preserveScroll: true,
            onSuccess: () => categoryForm.reset('name'),
        });
    };

    const deleteCategory = (id: number) => {
        if (confirm(t.charges.deleteCategoryConfirm)) {
            router.delete(`/charge-categories/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={t.charges.title}>
            <Head title={t.charges.title} />

            {/* Filters */}
            <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="sm">
                    <Select
                        placeholder={t.expenses.allProjects}
                        data={projectOptions}
                        value={projectId}
                        onChange={(v) => setProjectId(v || '')}
                        clearable
                    />
                    <Select
                        placeholder={t.charges.allCategories}
                        data={categoryOptions}
                        value={categoryId}
                        onChange={(v) => setCategoryId(v || '')}
                        clearable
                    />
                    <DatePicker
                        placeholder={t.expenses.from}
                        value={dateFrom}
                        onChange={(v) => setDateFrom(v)}
                    />
                    <DatePicker
                        placeholder={t.expenses.to}
                        value={dateTo}
                        onChange={(v) => setDateTo(v)}
                    />
                </SimpleGrid>
                <Group>
                    <Button size="xs" onClick={applyFilters}>{t.common.filter}</Button>
                    <Button size="xs" variant="subtle" onClick={clearFilters}>{t.common.clear}</Button>
                    <Text size="sm" c="dimmed" ml="auto">
                        {t.common.total}: <Text span fw={700}>TZS {formatMoney(totalFiltered, language)}</Text>
                        {' '}({charges.total} {t.common.records})
                    </Text>
                </Group>
            </Paper>

            {/* Actions */}
            <Group justify="flex-end" mb="md" gap="sm">
                <Button variant="light" onClick={() => setModalOpen(true)}>
                    {t.charges.manageCategories}
                </Button>
                <Button component={Link} href="/charges/create">
                    {t.charges.addCharge}
                </Button>
            </Group>

            {/* Table */}
            <Paper shadow="xs" radius="md" withBorder>
                <Table.ScrollContainer minWidth={700}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t.common.date}</Table.Th>
                            <Table.Th>{t.charges.description}</Table.Th>
                            <Table.Th>{t.expenses.category}</Table.Th>
                            <Table.Th>{t.expenses.project}</Table.Th>
                            <Table.Th ta="right">{t.charges.amount}</Table.Th>
                            <Table.Th ta="center">{t.common.actions}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {charges.data.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={6}>
                                    <Text ta="center" c="dimmed" py="lg">{t.charges.noCharges}</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                        {charges.data.map((charge) => (
                            <Table.Tr key={charge.id}>
                                <Table.Td><Text size="sm">{formatDate(charge.date, language)}</Text></Table.Td>
                                <Table.Td><Text size="sm" fw={500}>{charge.description}</Text></Table.Td>
                                <Table.Td>
                                    <Badge variant="light" size="sm">
                                        {charge.category?.name || categoryMap[charge.charge_category_id] || '—'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td><Text size="sm">{charge.project?.name}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={600}>{formatMoney(charge.amount, language)}</Text></Table.Td>
                                <Table.Td ta="center">
                                    <Group gap="xs" justify="center">
                                        <Button
                                            component={Link}
                                            href={`/charges/${charge.id}/edit`}
                                            size="compact-xs"
                                            variant="subtle"
                                        >
                                            {t.common.edit}
                                        </Button>
                                        <Button
                                            size="compact-xs"
                                            variant="subtle"
                                            color="red"
                                            onClick={() => {
                                                if (confirm(t.charges.deleteConfirm)) {
                                                    router.delete(`/charges/${charge.id}`);
                                                }
                                            }}
                                        >
                                            {t.common.delete}
                                        </Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
                </Table.ScrollContainer>
            </Paper>

            {charges.last_page > 1 && (
                <Group justify="center" mt="md">
                    <Pagination
                        total={charges.last_page}
                        value={charges.current_page}
                        onChange={(page) => router.get('/charges', { ...filters, page }, { preserveState: true })}
                    />
                </Group>
            )}

            {/* Category Management Modal */}
            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title={t.charges.manageCategories}
            >
                <form onSubmit={addCategory}>
                    <Group mb="md">
                        <TextInput
                            placeholder={t.charges.categoryName}
                            value={categoryForm.data.name}
                            onChange={(e) => categoryForm.setData('name', e.target.value)}
                            error={categoryForm.errors.name}
                            style={{ flex: 1 }}
                        />
                        <Button type="submit" loading={categoryForm.processing} size="sm">
                            {t.common.save}
                        </Button>
                    </Group>
                </form>

                {categories.length === 0 && (
                    <Text c="dimmed" ta="center" size="sm">{t.common.noDataYet}</Text>
                )}

                {categories.map((cat) => (
                    <Group key={cat.id} justify="space-between" mb="xs">
                        <Text size="sm">{cat.name}</Text>
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={() => deleteCategory(cat.id)}
                        >
                            ✕
                        </ActionIcon>
                    </Group>
                ))}
            </Modal>
        </AuthenticatedLayout>
    );
}
