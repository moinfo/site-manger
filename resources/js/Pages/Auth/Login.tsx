import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Stack,
    Alert,
    Anchor,
    Group,
    Text,
    Divider,
} from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t.auth.signIn} />

            <Stack gap="xs" mb="lg">
                <Text size="lg" fw={600} ta="center">{t.auth.welcomeBack}</Text>
                <Text size="sm" c="dimmed" ta="center">{t.auth.signInSubtitle}</Text>
            </Stack>

            <Divider mb="lg" color="light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.1))" />

            {status && (
                <Alert color="green" mb="md" radius="md">{status}</Alert>
            )}

            <form onSubmit={submit}>
                <Stack gap="md">
                    <TextInput
                        label={t.auth.emailLabel}
                        type="email"
                        placeholder="you@example.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        autoComplete="username"
                        autoFocus
                        required
                        size="md"
                        styles={{
                            input: {
                                background: 'light-dark(rgba(255,255,255,0.5), rgba(255,255,255,0.06))',
                                borderColor: 'light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.1))',
                            },
                        }}
                    />

                    <PasswordInput
                        label={t.auth.passwordLabel}
                        placeholder="Your password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        autoComplete="current-password"
                        required
                        size="md"
                        styles={{
                            input: {
                                background: 'light-dark(rgba(255,255,255,0.5), rgba(255,255,255,0.06))',
                                borderColor: 'light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.1))',
                            },
                        }}
                    />

                    <Group justify="space-between">
                        <Checkbox
                            label={t.auth.rememberMe}
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.currentTarget.checked)}
                            size="sm"
                        />

                        {canResetPassword && (
                            <Anchor component={Link} href={route('password.request')} size="sm">
                                {t.auth.forgotPassword}
                            </Anchor>
                        )}
                    </Group>

                    <Button
                        type="submit"
                        loading={processing}
                        fullWidth
                        size="md"
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                        mt="xs"
                    >
                        {t.auth.signIn}
                    </Button>
                </Stack>
            </form>
        </GuestLayout>
    );
}
