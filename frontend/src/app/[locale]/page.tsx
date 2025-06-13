// src/app/[locale]/page.tsx
import { redirect } from 'next/navigation'

type Props = {
  params: { locale: string }
}

export default function LocaleRootRedirect({ params: { locale } }: Props) {
  redirect(`/${locale}/home`)
}
