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
    Progress,
    RingProgress,
} from '@mantine/core';
import { BarChart, PieChart, AreaChart, DonutChart } from '@mantine/charts';
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
        total_projects: number;
        total_subcontractors: number;
    };
    monthlySpending: { month: string; total: number }[];
    monthlyCashFlow: { month: string; 'Cash In': number; 'Cash Out': number }[];
    spendingByCategory: { category: string; total: number }[];
    projectBudgets: { name: string; budget: number; spent: number; percentage: number }[];
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

function StatCard({ label, value, icon, color = 'blue', subtitle }: { label: string; value: string; icon: string; color?: string; subtitle?: string }) {
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
                    {subtitle && <Text size="xs" c="dimmed" mt={4}>{subtitle}</Text>}
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

export default function Dashboard({ stats, monthlySpending, monthlyCashFlow, spendingByCategory, projectBudgets, subcontractorBalances, recentExpenses }: Props) {
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

    const budgetUsed = stats.total_spent > 0 && stats.total_received > 0
        ? Math.round((stats.total_spent / stats.total_received) * 100)
        : 0;

    return (
        <AuthenticatedLayout header={t.dashboard.title}>
            <Head title={t.dashboard.title} />

            {/* Stats Cards - Row 1 */}
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="lg">
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

            {/* Stats Cards - Row 2: Quick counts + Budget ring */}
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="xl">
                <StatCard
                    label={t.dashboard.activeProjects || 'Active Projects'}
                    value={String(stats.active_projects)}
                    icon="🏗️"
                    color="violet"
                    subtitle={`${stats.total_projects} total`}
                />
                <StatCard
                    label={t.dashboard.subcontractors || 'Subcontractors'}
                    value={String(stats.total_subcontractors)}
                    icon="👷"
                    color="cyan"
                />
                <Paper shadow="sm" p="lg" radius="md" style={{ borderLeft: '4px solid var(--mantine-color-indigo-6)' }}>
                    <Group justify="space-between" align="center" wrap="nowrap">
                        <div>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={6}>
                                {t.dashboard.budgetUsed || 'Budget Used'}
                            </Text>
                            <Text size="xl" fw={800} c="indigo" style={{ lineHeight: 1.1 }}>{budgetUsed}%</Text>
                            <Text size="xs" c="dimmed" mt={4}>of received funds</Text>
                        </div>
                        <RingProgress
                            size={64}
                            thickness={6}
                            roundCaps
                            sections={[{ value: Math.min(budgetUsed, 100), color: budgetUsed > 90 ? 'red' : budgetUsed > 70 ? 'orange' : 'indigo' }]}
                        />
                    </Group>
                </Paper>
                <Paper shadow="sm" p="lg" radius="md" style={{ borderLeft: '4px solid var(--mantine-color-pink-6)' }}>
                    <Group justify="space-between" align="center" wrap="nowrap">
                        <div>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={6}>
                                {t.dashboard.netFlow || 'Net Cash Flow'}
                            </Text>
                            <Text size="xl" fw={800} c={stats.cash_balance >= 0 ? 'green' : 'red'} style={{ lineHeight: 1.1 }}>
                                {stats.cash_balance >= 0 ? '+' : ''}{formatMoney(stats.cash_balance, language)}
                            </Text>
                            <Text size="xs" c="dimmed" mt={4}>received - spent</Text>
                        </div>
                        <ThemeIcon size={44} radius="md" variant="light" color="pink" style={{ flexShrink: 0 }}>
                            <Text size="lg">{stats.cash_balance >= 0 ? '📈' : '📉'}</Text>
                        </ThemeIcon>
                    </Group>
                </Paper>
            </SimpleGrid>

            {/* Charts Row 1: Cash Flow Trend + Monthly Spending */}
            <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Text fw={700} size="md" mb="sm">{t.dashboard.cashFlowTrend || 'Cash Flow Trend'}</Text>
                    <Divider mb="md" />
                    {monthlyCashFlow.length > 0 ? (
                        <AreaChart
                            h={280}
                            data={monthlyCashFlow}
                            dataKey="month"
                            series={[
                                { name: 'Cash In', color: 'green.6' },
                                { name: 'Cash Out', color: 'red.4' },
                            ]}
                            valueFormatter={(value) => formatMoney(value, language)}
                            gridAxis="y"
                            curveType="natural"
                            withDots
                            fillOpacity={0.2}
                        />
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">{t.common.noDataYet}</Text>
                    )}
                </Paper>

                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Text fw={700} size="md" mb="sm">{t.dashboard.monthlySpendingTrend}</Text>
                    <Divider mb="md" />
                    {barData.length > 0 ? (
                        <BarChart
                            h={280}
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
            </SimpleGrid>

            {/* Charts Row 2: Spending by Category + Project Budget Utilization */}
            <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Text fw={700} size="md" mb="sm">{t.dashboard.spendingByCategory}</Text>
                    <Divider mb="md" />
                    {pieData.length > 0 ? (
                        <DonutChart
                            h={280}
                            data={pieData}
                            valueFormatter={(value) => `TZS ${formatMoney(value, language)}`}
                            withTooltip
                            tooltipDataSource="segment"
                            thickness={28}
                            paddingAngle={2}
                        />
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">{t.common.noDataYet}</Text>
                    )}
                </Paper>

                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Text fw={700} size="md" mb="sm">{t.dashboard.projectBudgets || 'Project Budget Usage'}</Text>
                    <Divider mb="md" />
                    {projectBudgets.length > 0 ? (
                        <Stack gap="md">
                            {projectBudgets.map((p) => (
                                <div key={p.name}>
                                    <Group justify="space-between" mb={4}>
                                        <Text size="sm" fw={500} truncate style={{ maxWidth: '60%' }}>{p.name}</Text>
                                        <Text size="xs" c="dimmed">
                                            {formatMoney(p.spent, language)} / {formatMoney(p.budget, language)}
                                        </Text>
                                    </Group>
                                    <Progress.Root size="lg" radius="md">
                                        <Progress.Section
                                            value={Math.min(p.percentage, 100)}
                                            color={p.percentage > 90 ? 'red' : p.percentage > 70 ? 'orange' : 'blue'}
                                        >
                                            <Progress.Label>{p.percentage}%</Progress.Label>
                                        </Progress.Section>
                                    </Progress.Root>
                                </div>
                            ))}
                        </Stack>
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">{t.common.noDataYet}</Text>
                    )}
                </Paper>
            </SimpleGrid>

            {/* Subcontractor Balances & Recent Expenses */}
            <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="sm">
                        <Text fw={700} size="md">{t.dashboard.subcontractorBalances}</Text>
                        <Anchor component={Link} href="/subcontractors" size="sm">
                            {t.dashboard.viewAll} →
                        </Anchor>
                    </Group>
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
