import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkRent | Passive Income from your LinkedIn Account",
  description: "Securely rent your established LinkedIn account to our vetted B2B agency and earn consistent monthly passive income. Turn your network into an asset.",
  keywords: ["LinkedIn account rental", "passive income", "rent LinkedIn", "B2B outreach", "make money online"],
  authors: [{ name: "LinkRent" }],
  openGraph: {
    title: "LinkRent | Earn Passive Income",
    description: "Rent your LinkedIn account securely to vetted agencies.",
    url: "https://getlinkrent.vercel.app",
    siteName: "LinkRent",
    images: [
      {
        url: "https://getlinkrent.vercel.app/poster_preview.png",
        width: 1200,
        height: 630,
        alt: "LinkRent - Passive Income",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkRent | Passive Income from your LinkedIn Account",
    description: "Securely rent your established LinkedIn account and earn consistent monthly passive income.",
    images: ["https://getlinkrent.vercel.app/poster_preview.png"],
  },
  other: {
    "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_ID || ""
  }
};

import { AuthProvider } from "@/components/AuthProvider";
import { ConsentModal } from "@/components/ConsentModal";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <head>
        {adSenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <AuthProvider>
          {children}
          <ConsentModal />
          <Toaster position="bottom-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
