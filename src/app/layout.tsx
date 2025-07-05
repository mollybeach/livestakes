// path: app/layout.tsx  (Next 13/14 App Router)
import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "./components/clientwrapper";
import Script from "next/script";
import { Suspense } from "react";
import PWAProvider from "./components/PWAProvider";
import Head from "next/head";
import SideNav from "./components/SideNav";
import Header from "./components/Header";
import Footer from "./components/Footer";

/* ------------------------------------------------------------------ */
/*  Global metadata                                                   */
/* ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: "livestakes.fun | AI-Powered Livestream Betting Platform",
  description:
    "Watch livestreams and bet on them with AI-generated opportunities.",
  keywords:
    "livestream, betting, AI betting, streaming platform, live entertainment, AI predictions, real-time betting, stream betting",
  authors: [{ name: "livestakes.fun Team" }],
  openGraph: {
    title: "livestakes.fun | AI-Powered Livestream Betting",
    description:
      "Watch livestreams and make money with AI-generated betting opportunities.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "livestakes.fun | Smart Betting on Live Streams",
    description: "AI-powered betting on livestreams. Watch, predict, earn.",
  },
  robots: "index, follow",
  manifest: "/manifest.json",
  themeColor: "#fcd34d", // pastel yellow
  applicationName: "livestakes.fun",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "livestakes.fun",
  },
  formatDetection: { telephone: false },
};

export const viewport = { themeColor: "#fcd34d" };

/* ------------------------------------------------------------------ */
/*  Root layout                                                       */
/* ------------------------------------------------------------------ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-pixel">
      <Head>
        {/* Pixel font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        {/* PWA / meta */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="livestakes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#fcd34d" />
      </Head>

      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KNZ740QZ04"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KNZ740QZ04', { page_path: window.location.pathname });
            `,
          }}
        />
      </head>

      {/* ---------------------------------------------------------------- */}
      {/*  Retro background + global typography                            */}
      {/* ---------------------------------------------------------------- */}
      <body className="min-h-screen bg-pink-200 text-purple-900">
        <ClientWrapper>
          <Header />
          <div className="flex">
            <SideNav />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Footer />
          <PWAProvider />
        </ClientWrapper>
      </body>
    </html>
  );
}
