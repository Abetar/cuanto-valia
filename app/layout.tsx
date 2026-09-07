import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/*
 * Cuando tengas dominio propio sólo agrega:
 *
 * NEXT_PUBLIC_SITE_URL=https://tudominio.com
 *
 * en Vercel.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://cuanto-valia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "Cuánto valía",

  title: {
    default:
      "Cuánto valía | Calculadora de inflación y poder adquisitivo en México",
    template: "%s | Cuánto valía",
  },

  description:
    "Descubre cuánto valía tu dinero en México desde 1993. Compara el poder adquisitivo del peso, inflación histórica y cuánto podías comprar con la misma cantidad de dinero.",

  keywords: [
    "inflación México",
    "calculadora inflación México",
    "cuánto valía el peso",
    "valor del dinero México",
    "poder adquisitivo México",
    "INPC México",
    "inflación histórica México",
    "precio tortilla histórico",
    "precios históricos México",
    "valor del peso mexicano",
    "calculadora INPC",
    "equivalencia dinero México",
    "cuánto valían 1000 pesos",
    "dinero antes y ahora",
    "inflación 1993 2026",
  ],

  authors: [
    {
      name: "Abraham Gómez",
    },
  ],

  creator: "Abraham Gómez",
  publisher: "AG Solutions",

  category: "finance",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",

    siteName: "Cuánto valía",

    title:
      "Cuánto valía | El valor de tu dinero a través del tiempo",

    description:
      "Compara cuánto valía tu dinero en México desde 1993 y descubre cuánto podías comprar en cada año.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cuánto valía - Comparador histórico del poder adquisitivo en México",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Cuánto valía | ¿Cuánto valía tu dinero en México?",

    description:
      "Compara inflación, poder adquisitivo y precios históricos en México desde 1993.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  other: {
    "theme-color": "#88bb15",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#88bb15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",

    name: "Cuánto valía",

    url: siteUrl,

    applicationCategory: "FinanceApplication",

    operatingSystem: "Web",

    inLanguage: "es-MX",

    description:
      "Herramienta para comparar el valor del dinero, inflación y poder adquisitivo en México desde 1993.",

    creator: {
      "@type": "Person",
      name: "Abraham Gómez",
    },

    publisher: {
      "@type": "Organization",
      name: "AG Solutions",
    },

    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "MXN",
    },

    isAccessibleForFree: true,
  };

  return (
    <html lang="es-MX">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              structuredData
            ).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}