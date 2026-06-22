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
  title: "LinkRent - Passive Income from your LinkedIn Account",
  description: "Securely rent your established LinkedIn account to our vetted B2B agency and earn consistent monthly passive income.",
};

import { AuthProvider } from "@/components/AuthProvider";
import { ConsentModal } from "@/components/ConsentModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <AuthProvider>
          {children}
          <ConsentModal />
        </AuthProvider>
      </body>
    </html>
  );
}
