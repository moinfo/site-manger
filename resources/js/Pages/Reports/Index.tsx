import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Paper, SimpleGrid, Text, Button, Stack, Group } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ReportsIndex() {
    const { t } = useLanguage();

    return (
        <AuthenticatedLayout header={t.reports.title}>
            <Head title={t.reports.title} />

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                <Paper shadow="xs" p="lg" radius="md" withBorder>
                    <Stack>
                        <Text fw={600}>{t.reports.monthlyExpenseReport}</Text>
                        <Text size="sm" c="dimmed">
                            {t.reports.monthlyExpenseDesc}
                        </Text>
                        <Group>
                            <Button component={Link} href="/reports/monthly" variant="filled" size="xs">
                                {t.reports.viewReport}
                            </Button>
                            <Button component="a" href="/reports/export/monthly-expenses-pdf" variant="light" size="xs">
                                {t.common.downloadPdf}
                            </Button>
                            <Button component="a" href="/reports/export/monthly-expenses-excel" variant="light" size="xs" color="green">
                                {t.common.downloadExcel}
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                <Paper shadow="xs" p="lg" radius="md" withBorder>
                    <Stack>
                        <Text fw={600}>{t.reports.subcontractorSummary}</Text>
                        <Text size="sm" c="dimmed">
                            {t.reports.subcontractorSummaryDesc}
                        </Text>
                        <Group>
                            <Button component={Link} href="/reports/subcontractors" variant="filled" size="xs">
                                {t.reports.viewReport}
                            </Button>
                            <Button component="a" href="/reports/export/subcontractors-pdf" variant="light" size="xs">
                                {t.common.downloadPdf}
                            </Button>
                            <Button component="a" href="/reports/export/subcontractors-excel" variant="light" size="xs" color="green">
                                {t.common.downloadExcel}
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                <Paper shadow="xs" p="lg" radius="md" withBorder>
                    <Stack>
                        <Text fw={600}>{t.reports.cashFlowStatement}</Text>
                        <Text size="sm" c="dimmed">
                            {t.reports.cashFlowStatementDesc}
                        </Text>
                        <Group>
                            <Button component={Link} href="/reports/cashflow" variant="filled" size="xs">
                                {t.reports.viewReport}
                            </Button>
                            <Button component="a" href="/reports/export/cashflow-pdf" variant="light" size="xs">
                                {t.common.downloadPdf}
                            </Button>
                            <Button component="a" href="/reports/export/cashflow-excel" variant="light" size="xs" color="green">
                                {t.common.downloadExcel}
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
                <Paper shadow="xs" p="lg" radius="md" withBorder>
                    <Stack>
                        <Text fw={600}>{t.reports.projectStatement}</Text>
                        <Text size="sm" c="dimmed">
                            {t.reports.projectStatementDesc}
                        </Text>
                        <Group>
                            <Button component={Link} href="/reports/project-statement" variant="filled" size="xs">
                                {t.reports.viewReport}
                            </Button>
                            <Button component="a" href="/reports/export/project-statement-pdf" variant="light" size="xs">
                                {t.common.downloadPdf}
                            </Button>
                            <Button component="a" href="/reports/export/project-statement-excel" variant="light" size="xs" color="green">
                                {t.common.downloadExcel}
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            </SimpleGrid>
        </AuthenticatedLayout>
    );
}
