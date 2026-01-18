import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image Optimizer - Compress & Resize Images Instantly",
  description:
    "Optimize your images with advanced compression, resizing, and format conversion. Fast, secure, and free. No registration required.",
  generator: "v0.app",
  keywords: [
    "image optimizer",
    "compress images",
    "resize images",
    "image converter",
    "webp converter",
  ],
  applicationName: "Image Optimizer",
  authors: [{ name: "Image Optimizer" }],
  creator: "Image Optimizer",
  publisher: "Image Optimizer",
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    title: "Image Optimizer - Compress & Resize Images Instantly",
    description:
      "Optimize your images with advanced compression, resizing, and format conversion.",
    url: "https://yoursite.com",
    siteName: "Image Optimizer",
    images: [
      {
        url: "https://yoursite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Image Optimizer",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Optimizer - Compress & Resize Images Instantly",
    description:
      "Optimize your images with advanced compression, resizing, and format conversion.",
    images: ["https://yoursite.com/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
