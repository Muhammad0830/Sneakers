import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LoadingProvider } from "@/context/LoadingContext";
import FullScreenLoader from "@/components/FullScreenLoader";
import GlobalLoader from "@/components/GlobalLoader";
import CustomToast from "@/components/CustomToast";
import NavChildrenFooter from "@/components/NavChildrenFooter";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <div lang={locale}>
      <NextIntlClientProvider>
        <LoadingProvider>
          <GlobalLoader />
          <FullScreenLoader />
          <div className="min-h-screen flex flex-col relative">
            <NavChildrenFooter>{children}</NavChildrenFooter>
            <CustomToast />
          </div>
        </LoadingProvider>
      </NextIntlClientProvider>
    </div>
  );
}
