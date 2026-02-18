import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Paper, SimpleGrid, Text, Table, Badge, Group, Button } from '@mantine/core';
import { formatMoney, formatDate } from '@/utils/format';
import { Project, Material } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    project: Project & { total_spent: number; total_received: number };
    recentExpenses: Material[];
}

export default function ProjectShow({ project, recentExpenses }: Props) {
    const { t, language } = useLanguage();

    return (
        <AuthenticatedLayout header={project.name}>
            <Head title={project.name} />

            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.common.budget}</Text>
                    <Text size="xl" fw={700}>TZS {formatMoney(project.budget, language)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.dashboard.totalSpent}</Text>
                    <Text size="xl" fw={700} c="orange">TZS {formatMoney(project.total_spent || 0, language)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{t.projects.remaining}</Text>
                    <Text size="xl" fw={700} c={project.budget - (project.total_spent || 0) >= 0 ? 'green' : 'red'}>
                        TZS {formatMoney(project.budget - (project.total_spent || 0), language)}
                    </Text>
                </Paper>
            </SimpleGrid>

            <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">{t.dashboard.recentExpenses}</Text>
                <Button component={Link} href={`/expenses?project_id=${project.id}`} variant="light" size="xs">
                    {t.projects.viewAllExpenses}
                </Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table.ScrollContainer minWidth={500}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t.common.date}</Table.Th>
                            <Table.Th>{t.expenses.description}</Table.Th>
                            <Table.Th>{t.expenses.category}</Table.Th>
                            <Table.Th ta="right">{t.expenses.subtotal}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {recentExpenses.map((e) => (
                            <Table.Tr key={e.id}>
                                <Table.Td><Text size="sm">{formatDate(e.date, language)}</Text></Table.Td>
                                <Table.Td><Text size="sm">{e.description}</Text></Table.Td>
                                <Table.Td><Badge variant="light" size="sm">{e.category}</Badge></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={600}>{formatMoney(e.subtotal, language)}</Text></Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
                </Table.ScrollContainer>
            </Paper>
        </AuthenticatedLayout>
    );
}
