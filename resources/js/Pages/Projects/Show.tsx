import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Paper, SimpleGrid, Text, Table, Badge, Group, Button } from '@mantine/core';
import { formatMoney, formatDate } from '@/utils/format';
import { Project, Material } from '@/types';

interface Props {
    project: Project & { total_spent: number; total_received: number };
    recentExpenses: Material[];
}

export default function ProjectShow({ project, recentExpenses }: Props) {
    return (
        <AuthenticatedLayout header={project.name}>
            <Head title={project.name} />

            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Budget</Text>
                    <Text size="xl" fw={700}>TZS {formatMoney(project.budget)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Spent</Text>
                    <Text size="xl" fw={700} c="orange">TZS {formatMoney(project.total_spent || 0)}</Text>
                </Paper>
                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Remaining</Text>
                    <Text size="xl" fw={700} c={project.budget - (project.total_spent || 0) >= 0 ? 'green' : 'red'}>
                        TZS {formatMoney(project.budget - (project.total_spent || 0))}
                    </Text>
                </Paper>
            </SimpleGrid>

            <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">Recent Expenses</Text>
                <Button component={Link} href={`/expenses?project_id=${project.id}`} variant="light" size="xs">
                    View All Expenses
                </Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Description</Table.Th>
                            <Table.Th>Category</Table.Th>
                            <Table.Th ta="right">Subtotal</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {recentExpenses.map((e) => (
                            <Table.Tr key={e.id}>
                                <Table.Td><Text size="sm">{formatDate(e.date)}</Text></Table.Td>
                                <Table.Td><Text size="sm">{e.description}</Text></Table.Td>
                                <Table.Td><Badge variant="light" size="sm">{e.category}</Badge></Table.Td>
                                <Table.Td ta="right"><Text size="sm" fw={600}>{formatMoney(e.subtotal)}</Text></Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>
        </AuthenticatedLayout>
    );
}
