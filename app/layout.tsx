import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BAFSK Math Club",
  description: "Official portal for BAFSK Math Club",
  icons: {
    icon: [
      { url: "/logo.jpg" },
      { url: "/logo.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/logo.jpg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "BAFSK Math Club",
    description: "Official portal for BAFSK Math Club",
    url: "https://bafskmc.vercel.app",
    siteName: "BAFSK Math Club",
    images: ["/logo.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BAFSK Math Club",
    description: "Official portal for BAFSK Math Club",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-[#0D0D0D]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

