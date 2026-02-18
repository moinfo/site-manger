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
} from '@mantine/core';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
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
            <Head title="Log in" />

            {status && (
                <Alert color="green" mb="md">{status}</Alert>
            )}

            <form onSubmit={submit}>
                <Stack>
                    <TextInput
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        autoComplete="username"
                        autoFocus
                        required
                    />

                    <PasswordInput
                        label="Password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        autoComplete="current-password"
                        required
                    />

                    <Group justify="space-between">
                        <Checkbox
                            label="Remember me"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.currentTarget.checked)}
                        />

                        {canResetPassword && (
                            <Anchor component={Link} href={route('password.request')} size="sm">
                                Forgot password?
                            </Anchor>
                        )}
                    </Group>

                    <Button type="submit" loading={processing} fullWidth>
                        Log in
                    </Button>
                </Stack>
            </form>
        </GuestLayout>
    );
}
