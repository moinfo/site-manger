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
    ActionIcon,
    Pagination,
    SimpleGrid,
    Stack,
} from '@mantine/core';
import { useState } from 'react';
import { formatMoney, formatDate } from '@/utils/format';
import { Material, PaginatedData, Project } from '@/types';

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
        <AuthenticatedLayout header="Expenses">
            <Head title="Expenses" />

            {/* Filters */}
            <Paper shadow="xs" p="md" radius="md" withBorder mb="md">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} mb="sm">
                    <TextInput
                        placeholder="Search description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    />
                    <Select
                        placeholder="All Projects"
                        data={projectOptions}
                        value={projectId}
                        onChange={(v) => setProjectId(v || '')}
                        clearable
                    />
                    <Select
                        placeholder="All Categories"
                        data={categoryOptions}
                        value={category}
                        onChange={(v) => setCategory(v || '')}
                        clearable
                    />
                    <TextInput
                        type="date"
                        placeholder="From"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <TextInput
                        type="date"
                        placeholder="To"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                    />
                </SimpleGrid>
                <Group>
                    <Button size="xs" onClick={applyFilters}>Filter</Button>
                    <Button size="xs" variant="subtle" onClick={clearFilters}>Clear</Button>
                    <Text size="sm" c="dimmed" ml="auto">
                        Total: <Text span fw={700} c="dark">TZS {formatMoney(totalFiltered)}</Text>
                        {' '}({expenses.total} records)
                    </Text>
                </Group>
            </Paper>

            {/* Actions */}
            <Group justify="flex-end" mb="md">
                <Button component={Link} href="/expenses/create">
                    + Add Expense
                </Button>
            </Group>

            {/* Table */}
            <Paper shadow="xs" radius="md" withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Description</Table.Th>
                            <Table.Th>Category</Table.Th>
                            <Table.Th>Project</Table.Th>
                            <Table.Th ta="right">Qty</Table.Th>
                            <Table.Th>Unit</Table.Th>
                            <Table.Th ta="right">Price</Table.Th>
                            <Table.Th ta="right">Subtotal</Table.Th>
                            <Table.Th ta="center">Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {expenses.data.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={9}>
                                    <Text ta="center" c="dimmed" py="lg">No expenses found.</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                        {expenses.data.map((expense) => (
                            <Table.Tr key={expense.id}>
                                <Table.Td><Text size="sm">{formatDate(expense.date)}</Text></Table.Td>
                                <Table.Td><Text size="sm" fw={500}>{expense.description}</Text></Table.Td>
                                <Table.Td>
                                    <Badge variant="light" size="sm">
                                        {categories[expense.category] || expense.category}
                                    </Badge>
                                </Table.Td>
                                <Table.Td><Text size="sm">{expense.project?.name}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm">{expense.quantity}</Text></Table.Td>
                                <Table.Td><Text size="sm">{expense.unit}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm">{formatMoney(expense.unit_price)}</Text></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={600}>{formatMoney(expense.subtotal)}</Text></Table.Td>
                                <Table.Td ta="center">
                                    <Group gap="xs" justify="center">
                                        <Button
                                            component={Link}
                                            href={`/expenses/${expense.id}/edit`}
                                            size="compact-xs"
                                            variant="subtle"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="compact-xs"
                                            variant="subtle"
                                            color="red"
                                            onClick={() => {
                                                if (confirm('Delete this expense?')) {
                                                    router.delete(`/expenses/${expense.id}`);
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
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
