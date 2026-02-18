import '../css/app.css';
import '../css/flatpickr-theme.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { LanguageProvider } from '@/contexts/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'Site Manager';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MantineProvider defaultColorScheme="auto">
                <LanguageProvider>
                    <ModalsProvider>
                        <Notifications position="top-right" />
                        <App {...props} />
                    </ModalsProvider>
                </LanguageProvider>
            </MantineProvider>
        );
    },
    progress: {
        color: '#228be6',
    },
});
