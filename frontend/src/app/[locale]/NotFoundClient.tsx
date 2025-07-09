'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function NotFoundClient() {
  const t = useTranslations('Home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold">404 - {t('notFoundTitle')}</h1>
      <p className="mt-4">{t('notFoundDescription')}</p>
      <Link href="/home" className="mt-6">
        <Button>{t('goHome')}</Button>
      </Link>
    </div>
  );
}
