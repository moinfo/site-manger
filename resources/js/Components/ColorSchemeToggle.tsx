import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';

export default function ColorSchemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light');

    return (
        <ActionIcon
            variant="subtle"
            size="lg"
            onClick={() => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle color scheme"
        >
            {computedColorScheme === 'dark' ? '☀️' : '🌙'}
        </ActionIcon>
    );
}
