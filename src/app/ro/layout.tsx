import "../../styles/globals.css";
import { Suspense, type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import NavMenu from "../../components/NavMenu";
import Footer from "../../components/Footer";
import FotoLinceBanner from "../../components/FotoLinceBanner";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import { GoogleAnalyticsScripts } from "../../components/analytics/GoogleAnalyticsScripts";
import { GaPageViewTracker } from "../../components/analytics/GaPageViewTracker";
import { WebVitalsReporter } from "../../components/analytics/WebVitalsReporter";
import CookieBanner from "../../components/CookieBanner";
import { SchemaOrg } from "../../components/SchemaOrg";

import { METADATA_BASE, SHARED_ICONS, SHARED_OPEN_GRAPH } from "../../lib/metadata-shared";

const LOCALE = "ro" as const;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "PDFLince - Unește, Comprimă, Divide și Convertește PDF-uri",
  description: "Instrumente PDF gratuite, online, pentru a uni, comprima, divide, extrage și converti. 100% privat, procesare locală în browserul tău.",
  icons: SHARED_ICONS,
  alternates: {
    canonical: "https://pdflince.com/ro",
    languages: {
      'es-ES': 'https://pdflince.com',
      'es-MX': 'https://pdflince.com',
      'es-CO': 'https://pdflince.com',
      'es-AR': 'https://pdflince.com',
      'es': 'https://pdflince.com',
      'en': 'https://pdflince.com/en',
      'en-US': 'https://pdflince.com/en',
      'fr': 'https://pdflince.com/fr',
      'fr-FR': 'https://pdflince.com/fr',
      'pt': 'https://pdflince.com/pt',
      'pt-BR': 'https://pdflince.com/pt',
      'pt-PT': 'https://pdflince.com/pt',
      'de': 'https://pdflince.com/de',
      'de-DE': 'https://pdflince.com/de',
      'it': 'https://pdflince.com/it',
      'it-IT': 'https://pdflince.com/it',
      'ro': 'https://pdflince.com/ro',
      'ro-RO': 'https://pdflince.com/ro',
      'ru': 'https://pdflince.com/ru',
      'ru-RU': 'https://pdflince.com/ru',
      'x-default': 'https://pdflince.com',
    },
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "PDFLince - Instrumente PDF gratuite și private în browserul tău",
    description: "Unește, comprimă, divide și convertește PDF-uri fără a încărca fișierele pe server. Securizat și 100% privat.",
    url: "https://pdflince.com/ro",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RoLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={LOCALE}>
      <head>
        <GoogleAnalyticsScripts />
        <SchemaOrg />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <LocaleProvider locale={LOCALE}>
          <WebVitalsReporter />
          <Suspense fallback={null}>
            <GaPageViewTracker />
          </Suspense>
          <NavMenu />
          <main>{children}</main>
          <FotoLinceBanner />
          <Footer />
          <CookieBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
