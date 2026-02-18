import { Button } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <Button
            variant="subtle"
            size="compact-sm"
            onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
            fw={700}
        >
            {language === 'en' ? 'EN' : 'SW'}
        </Button>
    );
}
