import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/clientwrapper";
import Script from "next/script";
import { Suspense } from "react";
import PWAProvider from "./components/PWAProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "livestakes.fun | AI-Powered Livestream Betting Platform",
  description: "Watch livestreams and bet on them with AI-generated betting opportunities. The future of interactive entertainment and earning.",
  keywords: "livestream, betting, AI betting, streaming platform, live entertainment, AI predictions, real-time betting, stream betting",
  authors: [{ name: "livestakes.fun Team" }],
  openGraph: {
    title: "livestakes.fun | AI-Powered Livestream Betting",
    description: "🎮 Watch livestreams and make money with AI-generated betting opportunities! The future of interactive entertainment.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "livestakes.fun | Smart Betting on Live Streams",
    description: "AI-powered betting on livestreams. Watch, predict, earn! 🚀",
  },
  robots: "index, follow",
  manifest: "/manifest.json",
  themeColor: "#8B5CF6",
  applicationName: "livestakes.fun",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "livestakes.fun",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-KNZ740QZ04`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KNZ740QZ04', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="livestakes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body className={inter.className}>


        <ClientWrapper>
            
            {children}
            <PWAProvider />
        </ClientWrapper>
      </body>
    </html>
  );
} 