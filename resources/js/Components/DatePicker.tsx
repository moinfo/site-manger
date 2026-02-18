import { useEffect, useRef } from 'react';
import { TextInput, type TextInputProps } from '@mantine/core';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

interface DatePickerProps extends Omit<TextInputProps, 'onChange' | 'value'> {
    value: string;
    onChange: (date: string) => void;
}

export default function DatePicker({ value, onChange, ...rest }: DatePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const fpRef = useRef<flatpickr.Instance | null>(null);

    useEffect(() => {
        if (!inputRef.current) return;

        fpRef.current = flatpickr(inputRef.current, {
            dateFormat: 'Y-m-d',
            defaultDate: value || undefined,
            allowInput: true,
            onChange: (_, dateStr) => {
                onChange(dateStr);
            },
        });

        return () => {
            fpRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (fpRef.current && value !== fpRef.current.input.value) {
            fpRef.current.setDate(value || '', false);
        }
    }, [value]);

    return (
        <TextInput
            ref={inputRef}
            readOnly
            styles={{ input: { cursor: 'pointer' } }}
            {...rest}
        />
    );
}
