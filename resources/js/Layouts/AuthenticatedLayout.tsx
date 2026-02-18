import { Link, router, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import {
    AppShell,
    Burger,
    Group,
    NavLink,
    Text,
    Menu,
    Avatar,
    UnstyledButton,
    Badge,
    Divider,
    Box,
    Title,
    Anchor,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { PageProps } from '@/types';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ColorSchemeToggle from '@/Components/ColorSchemeToggle';
import LanguageToggle from '@/Components/LanguageToggle';

interface Props {
    header?: ReactNode;
    children: ReactNode;
}

export default function AuthenticatedLayout({ header, children }: Props) {
    const { auth, flash } = usePage<PageProps>().props;
    const [opened, { toggle, close }] = useDisclosure();
    const currentPath = window.location.pathname;
    const { t } = useLanguage();

    const navItems = [
        { label: t.nav.dashboard, href: '/dashboard', icon: '📊' },
        { label: t.nav.expenses, href: '/expenses', icon: '💰' },
        { label: t.nav.projects, href: '/projects', icon: '🏗️' },
        { label: t.nav.subcontractors, href: '/subcontractors', icon: '👷' },
        { label: t.nav.cashFlow, href: '/cashflow', icon: '🏦' },
        { label: t.nav.charges, href: '/charges', icon: '🏷️' },
        { label: t.nav.reports, href: '/reports', icon: '📋' },
    ];

    const adminItems = [
        { label: t.nav.users, href: '/users', icon: '👥' },
    ];

    useEffect(() => {
        if (flash?.success) {
            notifications.show({
                title: t.common.success,
                message: flash.success,
                color: 'green',
            });
        }
        if (flash?.error) {
            notifications.show({
                title: t.common.error,
                message: flash.error,
                color: 'red',
            });
        }
    }, [flash]);

    const handleLogout = () => {
        router.post('/logout');
    };

    const roleColor = {
        admin: 'red',
        manager: 'blue',
        accountant: 'green',
        viewer: 'gray',
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Text size="lg" fw={700}>{t.common.siteManager}</Text>
                    </Group>

                    <Group gap="xs">
                        <LanguageToggle />
                        <ColorSchemeToggle />

                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <UnstyledButton>
                                    <Group gap="xs">
                                        <Avatar color="blue" radius="xl" size="sm">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box visibleFrom="sm">
                                            <Text size="sm" fw={500}>{auth.user.name}</Text>
                                            <Badge size="xs" color={roleColor[auth.user.role]} variant="light">
                                                {auth.user.role}
                                            </Badge>
                                        </Box>
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item component={Link} href="/profile">
                                    {t.common.profile}
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item color="red" onClick={handleLogout}>
                                    {t.common.logOut}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        component={Link}
                        href={item.href}
                        label={item.label}
                        leftSection={<Text size="sm">{item.icon}</Text>}
                        active={currentPath.startsWith(item.href)}
                        variant="light"
                        mb={2}
                        onClick={close}
                    />
                ))}

                {auth.user.role === 'admin' && (
                    <>
                        <Divider my="sm" label={t.nav.admin} labelPosition="center" />
                        {adminItems.map((item) => (
                            <NavLink
                                key={item.href}
                                component={Link}
                                href={item.href}
                                label={item.label}
                                leftSection={<Text size="sm">{item.icon}</Text>}
                                active={currentPath.startsWith(item.href)}
                                variant="light"
                                mb={2}
                                onClick={close}
                            />
                        ))}
                    </>
                )}
            </AppShell.Navbar>

            <AppShell.Main>
                {header && (
                    <Title order={2} mb="md">{header}</Title>
                )}
                {children}

                <Group justify="space-between" mt="xl" pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
                    <Text size="xs" c="dimmed">{t.common.copyright}</Text>
                    <Text size="xs" c="dimmed">
                        {t.common.poweredBy} <Anchor href="https://moinfotech.co.tz" target="_blank" size="xs">Moinfotech</Anchor>
                    </Text>
                </Group>
            </AppShell.Main>
        </AppShell>
    );
}
