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
    Box,
    Anchor,
    Divider,
    ThemeIcon,
} from '@mantine/core';
import { BarChart, PieChart } from '@mantine/charts';
import { formatMoney, formatDate } from '@/utils/format';
import { Material } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

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

function StatCard({ label, value, icon, color = 'blue' }: { label: string; value: string; icon: string; color?: string }) {
    return (
        <Paper
            shadow="sm"
            p="lg"
            radius="md"
            style={{
                borderLeft: `4px solid var(--mantine-color-${color}-6)`,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <div style={{ minWidth: 0, flex: 1 }}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={6}>{label}</Text>
                    <Text size="xl" fw={800} c={color} style={{ lineHeight: 1.1 }}>{value}</Text>
                </div>
                <ThemeIcon
                    size={44}
                    radius="md"
                    variant="light"
                    color={color}
                    style={{ flexShrink: 0 }}
                >
                    <Text size="lg">{icon}</Text>
                </ThemeIcon>
            </Group>
        </Paper>
    );
}

export default function Dashboard({ stats, monthlySpending, spendingByCategory, subcontractorBalances, recentExpenses }: Props) {
    const { t, language } = useLanguage();

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
        <AuthenticatedLayout header={t.dashboard.title}>
            <Head title={t.dashboard.title} />

            {/* Stats Cards */}
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="xl">
                <StatCard
                    label={t.dashboard.spentThisMonth}
                    value={`TZS ${formatMoney(stats.spent_this_month, language)}`}
                    icon="📅"
                    color="blue"
                />
                <StatCard
                    label={t.dashboard.totalSpent}
                    value={`TZS ${formatMoney(stats.total_spent, language)}`}
                    icon="💸"
                    color="orange"
                />
                <StatCard
                    label={t.dashboard.totalReceived}
                    value={`TZS ${formatMoney(stats.total_received, language)}`}
                    icon="📥"
                    color="green"
                />
                <StatCard
                    label={t.dashboard.cashBalance}
                    value={`TZS ${formatMoney(stats.cash_balance, language)}`}
                    icon="🏦"
                    color={stats.cash_balance >= 0 ? 'teal' : 'red'}
                />
            </SimpleGrid>

            {/* Charts */}
            <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Text fw={700} size="md" mb="sm">{t.dashboard.monthlySpendingTrend}</Text>
                    <Divider mb="md" />
                    {barData.length > 0 ? (
                        <BarChart
                            h={260}
                            data={barData}
                            dataKey="month"
                            series={[{ name: 'Spending', color: 'blue.6' }]}
                            valueFormatter={(value) => formatMoney(value, language)}
                            gridAxis="y"
                        />
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">{t.common.noDataYet}</Text>
                    )}
                </Paper>

                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Text fw={700} size="md" mb="sm">{t.dashboard.spendingByCategory}</Text>
                    <Divider mb="md" />
                    {pieData.length > 0 ? (
                        <PieChart
                            h={260}
                            data={pieData}
                            valueFormatter={(value) => `TZS ${formatMoney(value, language)}`}
                            withTooltip
                            withLabelsLine
                            labelsType="percent"
                        />
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">{t.common.noDataYet}</Text>
                    )}
                </Paper>
            </SimpleGrid>

            {/* Subcontractor Balances & Recent Expenses */}
            <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Text fw={700} size="md" mb="sm">{t.dashboard.subcontractorBalances}</Text>
                    <Divider mb="md" />
                    {subcontractorBalances.length > 0 ? (
                        <Table.ScrollContainer minWidth={450}>
                        <Table striped highlightOnHover verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t.common.name}</Table.Th>
                                    <Table.Th ta="right">{t.dashboard.billed}</Table.Th>
                                    <Table.Th ta="right">{t.dashboard.paid}</Table.Th>
                                    <Table.Th ta="right">{t.dashboard.balance}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {subcontractorBalances.map((sub) => (
                                    <Table.Tr key={sub.id}>
                                        <Table.Td>
                                            <Anchor component={Link} href={`/subcontractors/${sub.id}`} size="sm" fw={500}>
                                                {sub.name}
                                            </Anchor>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm">{formatMoney(sub.total_billed, language)}</Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm">{formatMoney(sub.total_paid, language)}</Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Badge
                                                color={sub.balance > 0 ? 'orange' : sub.balance < 0 ? 'red' : 'green'}
                                                variant="light"
                                                size="md"
                                            >
                                                {formatMoney(Math.abs(sub.balance), language)}
                                            </Badge>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                        </Table.ScrollContainer>
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">{t.subcontractors.noSubcontractors}</Text>
                    )}
                </Paper>

                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="sm">
                        <Text fw={700} size="md">{t.dashboard.recentExpenses}</Text>
                        <Anchor component={Link} href="/expenses" size="sm">
                            {t.dashboard.viewAll} →
                        </Anchor>
                    </Group>
                    <Divider mb="md" />
                    {recentExpenses.length > 0 ? (
                        <Stack gap={0}>
                            {recentExpenses.map((expense, i) => (
                                <Box key={expense.id}>
                                    <Group justify="space-between" py="sm" wrap="nowrap" gap="sm">
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <Text size="sm" fw={500} truncate="end">{expense.description}</Text>
                                            <Text size="xs" c="dimmed">{formatDate(expense.date, language)}</Text>
                                        </div>
                                        <Text size="sm" fw={700} style={{ flexShrink: 0 }}>
                                            TZS {formatMoney(expense.subtotal, language)}
                                        </Text>
                                    </Group>
                                    {i < recentExpenses.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">{t.expenses.noExpenses}</Text>
                    )}
                </Paper>
            </SimpleGrid>
        </AuthenticatedLayout>
    );
}
