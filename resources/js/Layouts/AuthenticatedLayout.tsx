import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { PageProps } from '@/types';
import { useEffect } from 'react';

interface Props {
    header?: ReactNode;
    children: ReactNode;
}

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Expenses', href: '/expenses', icon: '💰' },
    { label: 'Projects', href: '/projects', icon: '🏗️' },
    { label: 'Subcontractors', href: '/subcontractors', icon: '👷' },
    { label: 'Cash Flow', href: '/cashflow', icon: '🏦' },
    { label: 'Reports', href: '/reports', icon: '📋' },
];

const adminItems = [
    { label: 'Users', href: '/users', icon: '👥' },
    { label: 'Import Data', href: '/import', icon: '📥' },
];

export default function AuthenticatedLayout({ header, children }: Props) {
    const { auth, flash } = usePage<PageProps>().props;
    const [opened, { toggle }] = useDisclosure();
    const currentPath = window.location.pathname;

    useEffect(() => {
        if (flash?.success) {
            notifications.show({
                title: 'Success',
                message: flash.success,
                color: 'green',
            });
        }
        if (flash?.error) {
            notifications.show({
                title: 'Error',
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
                        <Text size="lg" fw={700}>Site Manager</Text>
                    </Group>

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
                                Profile
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" onClick={handleLogout}>
                                Log Out
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
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
                    />
                ))}

                {auth.user.role === 'admin' && (
                    <>
                        <Divider my="sm" label="Admin" labelPosition="center" />
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
            </AppShell.Main>
        </AppShell>
    );
}
