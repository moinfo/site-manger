export function formatMoney(amount: number, language: 'en' | 'sw' = 'en'): string {
    return new Intl.NumberFormat(language === 'sw' ? 'sw-TZ' : 'en-TZ', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: string, language: 'en' | 'sw' = 'en'): string {
    return new Date(date).toLocaleDateString(language === 'sw' ? 'sw-TZ' : 'en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
