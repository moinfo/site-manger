import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Table,
    Button,
    Group,
    TextInput,
    Select,
    Paper,
    Text,
    Badge,
    Pagination,
    SimpleGrid,
} from '@mantine/core';
import { useState } from 'react';
import { formatMoney, formatDate } from '@/utils/format';
import { Material, PaginatedData, Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import DatePicker from '@/Components/DatePicker';

interface Props {
    expenses: PaginatedData<Material>;
    filters: {
        project_id?: string;
        category?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
    projects: Project[];
    categories: Record<string, string>;
    totalFiltered: number;
}

export default function ExpensesIndex({ expenses, filters, projects, categories, totalFiltered }: Props) {
    const { t, language } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [category, setCategory] = useState(filters.category || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilters = () => {
        router.get('/expenses', {
            search: search || undefined,
            project_id: projectId || undefined,
            category: category || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setProjectId('');
        setCategory('');
        setDateFrom('');
        setDateTo('');
        router.get('/expenses');
    };

    const projectOptions = projects.map(p => ({ value: String(p.id), label: p.name }));
    const categoryOptions = Object.entries(categories).map(([k, v]) => ({ value: k, label: v }));

    return (
        <AuthenticatedLayout header={t.expenses.title}>
            <Head title={t.expenses.title} />

            {/* Filters */}
            <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} mb="sm">
                    <TextInput
                        placeholder={t.expenses.searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    />
                    <Select
                        placeholder={t.expenses.allProjects}
                        data={projectOptions}
                        value={projectId}
                        onChange={(v) => setProjectId(v || '')}
                        clearable
                    />
                    <Select
                        placeholder={t.expenses.allCategories}
                        data={categoryOptions}
                        value={category}
                        onChange={(v) => setCategory(v || '')}
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
                        {' '}({expenses.total} {t.common.records})
                    </Text>
                </Group>
            </Paper>

            {/* Actions */}
            <Group justify="flex-end" mb="md">
                <Button component={Link} href="/expenses/create">
                    {t.expenses.addExpense}
                </Button>
            </Group>

            {/* Table */}
            <Paper shadow="xs" radius="md" withBorder>
                <Table.ScrollContainer minWidth={800}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t.common.date}</Table.Th>
                            <Table.Th>{t.expenses.description}</Table.Th>
                            <Table.Th>{t.expenses.category}</Table.Th>
                            <Table.Th>{t.expenses.project}</Table.Th>
                            <Table.Th ta="right">{t.expenses.qty}</Table.Th>
                            <Table.Th>{t.expenses.unit}</Table.Th>
                            <Table.Th ta="right">{t.expenses.price}</Table.Th>
                            <Table.Th ta="right">{t.expenses.subtotal}</Table.Th>
                            <Table.Th ta="center">{t.common.actions}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {expenses.data.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={9}>
                                    <Text ta="center" c="dimmed" py="lg">{t.expenses.noExpenses}</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                        {expenses.data.map((expense) => (
                            <Table.Tr key={expense.id}>
                                <Table.Td><Text size="sm">{formatDate(expense.date, language)}</Text></Table.Td>
                                <Table.Td><Text size="sm" fw={500}>{expense.description}</Text></Table.Td>
                                <Table.Td>
                                    <Badge variant="light" size="sm">
                                        {categories[expense.category] || expense.category}
                                    </Badge>
                                </Table.Td>
                                <Table.Td><Text size="sm">{expense.project?.name}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm">{expense.quantity}</Text></Table.Td>
                                <Table.Td><Text size="sm">{expense.unit}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm">{formatMoney(expense.unit_price, language)}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={600}>{formatMoney(expense.subtotal, language)}</Text></Table.Td>
                                <Table.Td ta="center">
                                    <Group gap="xs" justify="center">
                                        <Button
                                            component={Link}
                                            href={`/expenses/${expense.id}/edit`}
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
                                                if (confirm(t.expenses.deleteConfirm)) {
                                                    router.delete(`/expenses/${expense.id}`);
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

            {expenses.last_page > 1 && (
                <Group justify="center" mt="md">
                    <Pagination
                        total={expenses.last_page}
                        value={expenses.current_page}
                        onChange={(page) => router.get('/expenses', { ...filters, page }, { preserveState: true })}
                    />
                </Group>
            )}
        </AuthenticatedLayout>
    );
}
