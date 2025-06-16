import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleRootRedirect({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/home`);
}