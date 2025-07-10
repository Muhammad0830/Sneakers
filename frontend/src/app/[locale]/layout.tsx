import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { LoadingProvider } from "@/context/LoadingContext";
import FullScreenLoader from "@/components/FullScreenLoader";
import GlobalLoader from "@/components/GlobalLoader";
// import { LoadingProvider } from "@/context/LoadingContext";

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
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="pt-18 flex-1 overflow-hidden">{children}</div>
            <Footer />
          </div>
        </LoadingProvider>
      </NextIntlClientProvider>
    </div>
  );
}
