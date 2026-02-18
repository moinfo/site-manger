import { PropsWithChildren } from 'react';
import { Anchor, Box, Center, Paper, Stack, Text, ThemeIcon, Group } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';
import ColorSchemeToggle from '@/Components/ColorSchemeToggle';
import LanguageToggle from '@/Components/LanguageToggle';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { t } = useLanguage();

    return (
        <Box
            style={{
                background: 'light-dark(#eef2f7, #0f1117)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Gradient orbs — visible through the glass */}
            <Box
                style={{
                    position: 'absolute',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'light-dark(rgba(34, 139, 230, 0.2), rgba(34, 139, 230, 0.15))',
                    filter: 'blur(80px)',
                    top: '10%',
                    left: '15%',
                    pointerEvents: 'none',
                }}
            />
            <Box
                style={{
                    position: 'absolute',
                    width: 350,
                    height: 350,
                    borderRadius: '50%',
                    background: 'light-dark(rgba(21, 170, 191, 0.2), rgba(21, 170, 191, 0.12))',
                    filter: 'blur(80px)',
                    bottom: '5%',
                    right: '10%',
                    pointerEvents: 'none',
                }}
            />
            <Box
                style={{
                    position: 'absolute',
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    background: 'light-dark(rgba(132, 94, 247, 0.12), rgba(132, 94, 247, 0.1))',
                    filter: 'blur(60px)',
                    top: '50%',
                    right: '30%',
                    pointerEvents: 'none',
                }}
            />

            {/* Top-right toggles */}
            <Group pos="absolute" top={16} right={16} gap="xs" style={{ zIndex: 10 }}>
                <LanguageToggle />
                <ColorSchemeToggle />
            </Group>

            <Center style={{ flex: 1, position: 'relative', zIndex: 1 }} py="xl" px="md">
                <Stack align="center" gap="lg" w="100%" maw={420}>
                    <Stack align="center" gap={4}>
                        <ThemeIcon size={56} radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 45 }}>
                            <Text size="xl" fw={700} c="white">SM</Text>
                        </ThemeIcon>
                        <Text size="xl" fw={700} mt="xs">{t.common.siteManager}</Text>
                        <Text size="sm" c="dimmed">{t.auth.constructionProjectMgmt}</Text>
                    </Stack>

                    <Paper
                        p={{ base: 20, sm: 32 }}
                        radius="xl"
                        w="100%"
                        maw={420}
                        style={{
                            backdropFilter: 'blur(20px) saturate(1.4)',
                            WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
                            background: 'light-dark(rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.06))',
                            border: 'light-dark(1px solid rgba(255, 255, 255, 0.7), 1px solid rgba(255, 255, 255, 0.1))',
                            boxShadow: 'light-dark(0 8px 32px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.4))',
                        }}
                    >
                        {children}
                    </Paper>

                    <Group justify="space-between" w="100%" maw={420} px="xs">
                        <Text size="xs" c="dimmed">{t.common.copyright}</Text>
                        <Text size="xs" c="dimmed">
                            {t.common.poweredBy} <Anchor href="https://moinfotech.co.tz" target="_blank" size="xs">Moinfotech</Anchor>
                        </Text>
                    </Group>
                </Stack>
            </Center>
        </Box>
    );
}
