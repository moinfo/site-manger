import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Table, Button, Group, Paper, Text, Badge, Progress } from '@mantine/core';
import { formatMoney } from '@/utils/format';
import { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    projects: (Project & { total_spent: number; total_received: number })[];
}

const statusColor: Record<string, string> = {
    active: 'green',
    completed: 'blue',
    on_hold: 'yellow',
};

export default function ProjectsIndex({ projects }: Props) {
    const { t, language } = useLanguage();

    const statusLabel: Record<string, string> = {
        active: t.projects.active,
        completed: t.projects.completed,
        on_hold: t.projects.onHold,
    };

    return (
        <AuthenticatedLayout header={t.projects.title}>
            <Head title={t.projects.title} />

            <Group justify="flex-end" mb="md">
                <Button component={Link} href="/projects/create">+ {t.projects.newProject}</Button>
            </Group>

            <Paper shadow="xs" radius="md" withBorder>
                <Table.ScrollContainer minWidth={700}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t.common.name}</Table.Th>
                            <Table.Th>{t.common.location}</Table.Th>
                            <Table.Th>{t.common.status}</Table.Th>
                            <Table.Th ta="right">{t.common.budget}</Table.Th>
                            <Table.Th ta="right">{t.projects.spent}</Table.Th>
                            <Table.Th>{t.projects.progress}</Table.Th>
                            <Table.Th ta="center">{t.common.actions}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {projects.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={7}>
                                    <Text ta="center" c="dimmed" py="lg">{t.projects.noProjects}</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                        {projects.map((project) => {
                            const pct = project.budget > 0
                                ? Math.min(100, ((project.total_spent || 0) / project.budget) * 100)
                                : 0;
                            return (
                                <Table.Tr key={project.id}>
                                    <Table.Td>
                                        <Link href={`/projects/${project.id}`}>
                                            <Text size="sm" fw={500} c="blue">{project.name}</Text>
                                        </Link>
                                    </Table.Td>
                                    <Table.Td><Text size="sm">{project.location}</Text></Table.Td>
                                    <Table.Td>
                                        <Badge color={statusColor[project.status]} variant="light" size="sm">
                                            {statusLabel[project.status] || project.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td ta="right">
                                        <Text size="sm">{project.budget > 0 ? formatMoney(project.budget, language) : '-'}</Text>
                                    </Table.Td>
                                    <Table.Td ta="right">
                                        <Text size="sm" fw={600}>{formatMoney(project.total_spent || 0, language)}</Text>
                                    </Table.Td>
                                    <Table.Td w={120}>
                                        {project.budget > 0 && (
                                            <Progress
                                                value={pct}
                                                color={pct > 90 ? 'red' : pct > 70 ? 'yellow' : 'blue'}
                                                size="sm"
                                            />
                                        )}
                                    </Table.Td>
                                    <Table.Td ta="center">
                                        <Group gap="xs" justify="center">
                                            <Button component={Link} href={`/projects/${project.id}/edit`} size="compact-xs" variant="subtle">{t.common.edit}</Button>
                                            <Button
                                                size="compact-xs" variant="subtle" color="red"
                                                onClick={() => { if (confirm(t.projects.deleteConfirm)) router.delete(`/projects/${project.id}`); }}
                                            >{t.common.delete}</Button>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
                </Table.ScrollContainer>
            </Paper>
        </AuthenticatedLayout>
    );
}
