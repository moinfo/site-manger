import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    SimpleGrid,
    Paper,
    Text,
    Group,
    Stack,
    Table,
    Badge,
    ThemeIcon,
} from '@mantine/core';
import { BarChart, PieChart } from '@mantine/charts';
import { formatMoney, formatDate } from '@/utils/format';
import { Material } from '@/types';

interface Props {
    stats: {
        spent_this_month: number;
        total_spent: number;
        total_received: number;
        cash_balance: number;
        active_projects: number;
    };
    monthlySpending: { month: string; total: number }[];
    spendingByCategory: { category: string; total: number }[];
    subcontractorBalances: {
        id: number;
        name: string;
        total_billed: number;
        total_paid: number;
        balance: number;
    }[];
    recentExpenses: Material[];
}

const COLORS = ['blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange', 'red', 'pink', 'grape', 'violet'];

function StatCard({ label, value, color = 'blue' }: { label: string; value: string; color?: string }) {
    return (
        <Paper shadow="xs" p="md" radius="md" withBorder>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{label}</Text>
            <Text size="xl" fw={700} c={color} mt={4}>{value}</Text>
        </Paper>
    );
}

export default function Dashboard({ stats, monthlySpending, spendingByCategory, subcontractorBalances, recentExpenses }: Props) {
    const pieData = spendingByCategory.map((item, i) => ({
        name: item.category,
        value: item.total,
        color: COLORS[i % COLORS.length] + '.6',
    }));

    const barData = monthlySpending.map(item => ({
        month: item.month,
        Spending: item.total,
    }));

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* Stats Cards */}
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="lg">
                <StatCard
                    label="Spent This Month"
                    value={`TZS ${formatMoney(stats.spent_this_month)}`}
                    color="blue"
                />
                <StatCard
                    label="Total Spent"
                    value={`TZS ${formatMoney(stats.total_spent)}`}
                    color="orange"
                />
                <StatCard
                    label="Total Received"
                    value={`TZS ${formatMoney(stats.total_received)}`}
                    color="green"
                />
                <StatCard
                    label="Cash Balance"
                    value={`TZS ${formatMoney(stats.cash_balance)}`}
                    color={stats.cash_balance >= 0 ? 'green' : 'red'}
                />
            </SimpleGrid>

            {/* Charts */}
            <SimpleGrid cols={{ base: 1, md: 2 }} mb="lg">
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text fw={600} mb="md">Monthly Spending Trend</Text>
                    {barData.length > 0 ? (
                        <BarChart
                            h={250}
                            data={barData}
                            dataKey="month"
                            series={[{ name: 'Spending', color: 'blue.6' }]}
                            valueFormatter={(value) => formatMoney(value)}
                        />
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">No data yet</Text>
                    )}
                </Paper>

                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text fw={600} mb="md">Spending by Category</Text>
                    {pieData.length > 0 ? (
                        <PieChart
                            h={250}
                            data={pieData}
                            valueFormatter={(value) => `TZS ${formatMoney(value)}`}
                            withTooltip
                        />
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">No data yet</Text>
                    )}
                </Paper>
            </SimpleGrid>

            {/* Subcontractor Balances & Recent Expenses */}
            <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text fw={600} mb="md">Subcontractor Balances</Text>
                    {subcontractorBalances.length > 0 ? (
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th ta="right">Billed</Table.Th>
                                    <Table.Th ta="right">Paid</Table.Th>
                                    <Table.Th ta="right">Balance</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {subcontractorBalances.map((sub) => (
                                    <Table.Tr key={sub.id}>
                                        <Table.Td>
                                            <Link href={`/subcontractors/${sub.id}`}>
                                                <Text size="sm" c="blue" fw={500}>{sub.name}</Text>
                                            </Link>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm">{formatMoney(sub.total_billed)}</Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm">{formatMoney(sub.total_paid)}</Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Badge
                                                color={sub.balance > 0 ? 'orange' : sub.balance < 0 ? 'red' : 'green'}
                                                variant="light"
                                            >
                                                {formatMoney(Math.abs(sub.balance))}
                                            </Badge>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">No subcontractors yet</Text>
                    )}
                </Paper>

                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Text fw={600}>Recent Expenses</Text>
                        <Link href="/expenses">
                            <Text size="sm" c="blue">View all</Text>
                        </Link>
                    </Group>
                    {recentExpenses.length > 0 ? (
                        <Stack gap="xs">
                            {recentExpenses.map((expense) => (
                                <Group key={expense.id} justify="space-between" py={4}>
                                    <div>
                                        <Text size="sm" fw={500}>{expense.description}</Text>
                                        <Text size="xs" c="dimmed">{formatDate(expense.date)}</Text>
                                    </div>
                                    <Text size="sm" fw={600}>TZS {formatMoney(expense.subtotal)}</Text>
                                </Group>
                            ))}
                        </Stack>
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">No expenses yet</Text>
                    )}
                </Paper>
            </SimpleGrid>
        </AuthenticatedLayout>
    );
}
