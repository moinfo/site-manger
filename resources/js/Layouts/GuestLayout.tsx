import { PropsWithChildren } from 'react';
import { Center, Paper, Stack, Text, Title } from '@mantine/core';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <Center mih="100vh" bg="gray.1">
            <Stack align="center" gap="md">
                <Title order={2}>Site Manager</Title>
                <Paper shadow="md" p="xl" radius="md" w={420}>
                    {children}
                </Paper>
            </Stack>
        </Center>
    );
}
