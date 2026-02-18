import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Paper, SimpleGrid, Text, Button, Stack, Group } from '@mantine/core';

export default function ReportsIndex() {
    return (
        <AuthenticatedLayout header="Reports">
            <Head title="Reports" />

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                <Paper shadow="xs" p="lg" radius="md" withBorder>
                    <Stack>
                        <Text fw={600}>Monthly Expense Report</Text>
                        <Text size="sm" c="dimmed">
                            Breakdown of all expenses by month and category.
                        </Text>
                        <Group>
                            <Button component="a" href="/reports/export/monthly-expenses-pdf" variant="light" size="xs">
                                Download PDF
                            </Button>
                            <Button component="a" href="/reports/export/monthly-expenses-excel" variant="light" size="xs" color="green">
                                Download Excel
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                <Paper shadow="xs" p="lg" radius="md" withBorder>
                    <Stack>
                        <Text fw={600}>Subcontractor Summary</Text>
                        <Text size="sm" c="dimmed">
                            All subcontractors with billed amounts, payments, and balances.
                        </Text>
                        <Group>
                            <Button component="a" href="/reports/export/subcontractors-pdf" variant="light" size="xs">
                                Download PDF
                            </Button>
                            <Button component="a" href="/reports/export/subcontractors-excel" variant="light" size="xs" color="green">
                                Download Excel
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                <Paper shadow="xs" p="lg" radius="md" withBorder>
                    <Stack>
                        <Text fw={600}>Cash Flow Statement</Text>
                        <Text size="sm" c="dimmed">
                            Monthly cash in vs cash out with running balance.
                        </Text>
                        <Group>
                            <Button component="a" href="/reports/export/cashflow-pdf" variant="light" size="xs">
                                Download PDF
                            </Button>
                            <Button component="a" href="/reports/export/cashflow-excel" variant="light" size="xs" color="green">
                                Download Excel
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            </SimpleGrid>
        </AuthenticatedLayout>
    );
}
