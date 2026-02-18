import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Paper, Text, Button, FileInput, Stack, Alert, List } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ImportIndex() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) return;

        const formData = new FormData();
        formData.append('file', data.file);

        post('/import', {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={t.import.title}>
            <Head title={t.import.title} />

            <Paper shadow="xs" p="lg" radius="md" withBorder maw={600}>
                <Stack>
                    <Text size="sm">
                        {t.import.description}
                    </Text>

                    <Alert color="yellow" variant="light">
                        <Text size="sm" fw={500}>{t.import.whatGetsImported}</Text>
                        <List size="sm" mt="xs">
                            <List.Item>{t.import.accountsSheets}</List.Item>
                            <List.Item>{t.import.subcontractorSheets}</List.Item>
                            <List.Item>{t.import.cashSheets}</List.Item>
                        </List>
                    </Alert>

                    <form onSubmit={submit}>
                        <FileInput
                            label={t.import.excelFile}
                            placeholder={t.import.choosePlaceholder}
                            accept=".xlsx,.xls"
                            value={data.file}
                            onChange={(file) => setData('file', file)}
                            error={errors.file}
                            mb="md"
                        />

                        <Button type="submit" loading={processing} disabled={!data.file}>
                            {t.import.importButton}
                        </Button>
                    </form>
                </Stack>
            </Paper>
        </AuthenticatedLayout>
    );
}
